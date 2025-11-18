import { useState, useRef, useCallback } from 'react';
import { useHeygenAvatar } from '@/hooks/freetalk/useHeygenAvatar';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { useFileUpload } from '@/hooks/files/useFileUpload';
import { useStartSessionMutation } from './mutations/useStartSessionMutation';
import { useReplyMutation } from './mutations/useReplyMutation';
import { useCompleteSessionMutation } from './mutations/useCompleteSessionMutation';
import { useSttMutation } from './mutations/useSttMutation';
import { logger } from '@/utils/common/loggerUtils';
import { TaskType } from '@heygen/streaming-avatar';
import type { Turn, FinalSummary } from '@/types/situation';

interface UseSituationConversationProps {
  situationId: number;
  onSessionEnd?: (finalSummary: FinalSummary) => void;
  onEvaluationFailed?: (turn: Turn) => void;
}

interface UseSituationConversationReturn {
  // 상태
  sessionId: string | null;
  turns: Turn[];
  currentTurnIndex: number;
  isRecording: boolean;
  isProcessing: boolean;
  finalSummary: FinalSummary | null;

  // 아바타 관련
  videoRef: React.RefObject<HTMLVideoElement | null>;
  avatarState: string;
  isSessionReady: boolean;
  avatarError: string | null;

  // 액션
  startConversation: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  endConversation: () => Promise<void>;
  resetConversation: () => void;
}

/**
 * 상황극 대화 관리 훅
 * - HeyGen 아바타 통합 (TaskType.REPEAT)
 * - 세션 시작 → 질문 → 녹음 → STT → 평가 → 다음 질문 플로우
 * - 최대 5턴까지
 */
export const useSituationConversation = ({
  situationId,
  onSessionEnd,
  onEvaluationFailed,
}: UseSituationConversationProps): UseSituationConversationReturn => {
  // 상태
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null);

  // Refs
  const currentQuestionRef = useRef<string>('');
  const isAvatarSpeakingRef = useRef(false);

  // Mutations
  const startSessionMutation = useStartSessionMutation();
  const replyMutation = useReplyMutation();
  const completeSessionMutation = useCompleteSessionMutation();
  const sttMutation = useSttMutation();

  // 파일 업로드
  const { uploadFile } = useFileUpload();

  // 오디오 녹음
  const audioRecorder = useAudioRecorder();

  // HeyGen 아바타
  const avatar = useHeygenAvatar({
    language: 'ko',
    callbacks: {
      onAvatarStartTalking: () => {
        logger.log('[AVATAR] 아바타 말하기 시작');
        isAvatarSpeakingRef.current = true;
      },
      onAvatarStopTalking: () => {
        logger.log('[AVATAR] 아바타 말하기 완료');
        isAvatarSpeakingRef.current = false;
      },
    },
  });

  /**
   * 대화 시작 (세션 시작 + 아바타 세션 시작 + 첫 질문)
   */
  const startConversation = useCallback(async () => {
    try {
      setIsProcessing(true);
      logger.log('[CONVERSATION] 대화 시작');

      // 1. 아바타 세션 시작
      logger.log('[CONVERSATION] Step 1: 아바타 세션 시작');
      await avatar.startSession();

      // 아바타 준비 대기 (최대 5초)
      let waitCount = 0;
      while (!avatar.isSessionReady && waitCount < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        waitCount++;
      }

      if (!avatar.isSessionReady) {
        throw new Error('아바타 세션 준비 실패');
      }

      // 2. 백엔드 세션 시작
      logger.log('[CONVERSATION] Step 2: 백엔드 세션 시작');
      const sessionResponse = await startSessionMutation.mutateAsync({ situationId });

      const newSessionId = sessionResponse.result.sessionId;
      const firstQuestion = sessionResponse.result.question;

      setSessionId(newSessionId);
      currentQuestionRef.current = firstQuestion;

      logger.log('[CONVERSATION] 세션 시작 완료', { sessionId: newSessionId, firstQuestion });

      // 3. 첫 질문을 턴 목록에 추가
      setTurns([
        {
          turnIndex: 1,
          question: firstQuestion,
        },
      ]);
      setCurrentTurnIndex(1);

      // 4. 아바타가 첫 질문 말하기
      logger.log('[CONVERSATION] Step 3: 아바타가 첫 질문 말하기');
      await avatar.speak(firstQuestion);

      setIsProcessing(false);
    } catch (error) {
      logger.error('[CONVERSATION] 대화 시작 실패:', error);
      setIsProcessing(false);
      throw error;
    }
  }, [situationId, avatar, startSessionMutation]);

  /**
   * 녹음 시작
   */
  const startRecording = useCallback(async () => {
    // 아바타가 말하는 중이면 녹음 불가
    if (isAvatarSpeakingRef.current) {
      logger.warn('[RECORDING] 아바타가 말하는 중에는 녹음할 수 없습니다');
      return;
    }

    if (isProcessing) {
      logger.warn('[RECORDING] 처리 중에는 녹음할 수 없습니다');
      return;
    }

    try {
      logger.log('[RECORDING] 녹음 시작');
      await audioRecorder.startRecording();
    } catch (error) {
      logger.error('[RECORDING] 녹음 시작 실패:', error);
      throw error;
    }
  }, [isProcessing, audioRecorder]);

  /**
   * 녹음 중지 및 답변 처리
   */
  const stopRecording = useCallback(async () => {
    if (!sessionId) {
      logger.error('[RECORDING] 세션이 시작되지 않았습니다');
      return;
    }

    try {
      setIsProcessing(true);
      logger.log('[RECORDING] 녹음 중지 및 답변 처리 시작');

      // 1. 녹음 중지
      const audioBlob = await audioRecorder.stopRecording();
      if (!audioBlob) {
        throw new Error('녹음 데이터가 없습니다');
      }

      logger.log('[RECORDING] 녹음 완료', { size: audioBlob.size });

      // 2. S3 업로드
      logger.log('[RECORDING] Step 1: S3 업로드');
      const fileName = `situation_${situationId}_turn${currentTurnIndex}_${Date.now()}.wav`;
      const fileKey = await uploadFile(audioBlob, 'situation', fileName);
      logger.log('[RECORDING] S3 업로드 완료', { fileKey });

      // 3. STT 변환
      logger.log('[RECORDING] Step 2: STT 변환');
      const audioFile = new File([audioBlob], fileName, { type: 'audio/wav' });
      const sttResponse = await sttMutation.mutateAsync(audioFile);
      const recognizedText = sttResponse.result.recognizedText;
      logger.log('[RECORDING] STT 변환 완료', { recognizedText, confidence: sttResponse.result.confidence });

      // 4. 답변 평가 API 호출
      logger.log('[RECORDING] Step 3: 답변 평가');
      const replyResponse = await replyMutation.mutateAsync({
        sessionId,
        answer: recognizedText,
        audioFileKey: fileKey,
      });

      const { evaluation, nextQuestion, turnIndex, isSessionEnd, finalSummary: summary } = replyResponse.result;

      logger.log('[RECORDING] 평가 결과', { evaluation, turnIndex, isSessionEnd });

      // 5. 현재 턴 업데이트 (답변 + 평가 추가)
      setTurns((prev) =>
        prev.map((turn) =>
          turn.turnIndex === currentTurnIndex
            ? { ...turn, answer: recognizedText, audioFileKey: fileKey, evaluation }
            : turn,
        ),
      );

      // 6. 평가 결과 처리
      if (!evaluation.isSuccess) {
        // 평가 실패
        logger.log('[RECORDING] 평가 실패 - 연습 모드로 전환');
        const failedTurn = turns.find((t) => t.turnIndex === currentTurnIndex);
        if (failedTurn && onEvaluationFailed) {
          onEvaluationFailed({
            ...failedTurn,
            answer: recognizedText,
            audioFileKey: fileKey,
            evaluation,
          });
        }
        setIsProcessing(false);
        return;
      }

      // 7. 세션 종료 여부 확인
      if (isSessionEnd && summary) {
        logger.log('[RECORDING] 세션 종료', { finalSummary: summary });
        setFinalSummary(summary);
        if (onSessionEnd) {
          onSessionEnd(summary);
        }
        setIsProcessing(false);
        return;
      }

      // 8. 다음 질문이 있으면 계속 진행
      if (nextQuestion) {
        logger.log('[RECORDING] 다음 질문', { nextQuestion, nextTurnIndex: turnIndex });

        // 다음 턴 추가
        setTurns((prev) => [
          ...prev,
          {
            turnIndex: turnIndex,
            question: nextQuestion,
          },
        ]);
        setCurrentTurnIndex(turnIndex);
        currentQuestionRef.current = nextQuestion;

        // 아바타가 다음 질문 말하기
        await avatar.speak(nextQuestion);
      }

      setIsProcessing(false);
    } catch (error) {
      logger.error('[RECORDING] 답변 처리 실패:', error);
      setIsProcessing(false);
      throw error;
    }
  }, [
    sessionId,
    situationId,
    currentTurnIndex,
    turns,
    audioRecorder,
    uploadFile,
    sttMutation,
    replyMutation,
    avatar,
    onSessionEnd,
    onEvaluationFailed,
  ]);

  /**
   * 대화 종료 (세션 종료 API 호출)
   */
  const endConversation = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    try {
      logger.log('[CONVERSATION] 대화 종료');
      const response = await completeSessionMutation.mutateAsync({ sessionId });
      setFinalSummary(response.result.finalSummary);

      // 아바타 세션 종료
      await avatar.endSession();

      logger.log('[CONVERSATION] 대화 종료 완료', { finalSummary: response.result.finalSummary });
    } catch (error) {
      logger.error('[CONVERSATION] 대화 종료 실패:', error);
      throw error;
    }
  }, [sessionId, completeSessionMutation, avatar]);

  /**
   * 대화 리셋 (세션은 유지, 대화만 초기화)
   */
  const resetConversation = useCallback(() => {
    logger.log('[CONVERSATION] 대화 리셋 (세션 유지)');
    setTurns([]);
    setCurrentTurnIndex(0);
    setFinalSummary(null);
    currentQuestionRef.current = '';
  }, []);

  return {
    // 상태
    sessionId,
    turns,
    currentTurnIndex,
    isRecording: audioRecorder.isRecording,
    isProcessing,
    finalSummary,

    // 아바타 관련
    videoRef: avatar.videoRef,
    avatarState: avatar.avatarState,
    isSessionReady: avatar.isSessionReady,
    avatarError: avatar.error,

    // 액션
    startConversation,
    startRecording,
    stopRecording,
    endConversation,
    resetConversation,
  };
};
