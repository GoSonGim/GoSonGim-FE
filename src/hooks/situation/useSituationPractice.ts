import { useState, useCallback } from 'react';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { useHeygenAvatar } from '@/hooks/freetalk/useHeygenAvatar';
import { TaskType } from '@heygen/streaming-avatar';
import { logger } from '@/utils/common/loggerUtils';

interface PracticeRecording {
  attemptNumber: number;
  audioBlob: Blob;
  timestamp: number;
}

interface UseSituationPracticeProps {
  onPracticeComplete?: () => void;
}

interface UseSituationPracticeReturn {
  // 상태
  sentence: string;
  practiceCount: number;
  recordings: PracticeRecording[];
  isRecording: boolean;
  isSpeaking: boolean;
  maxPracticeCount: number;

  // 아바타
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isSessionReady: boolean;
  avatarState: 'idle' | 'loading' | 'speaking' | 'listening' | 'error';
  avatarError: string | null;

  // 액션
  setSentence: (sentence: string) => void;
  startSession: () => Promise<void>;
  speakSentence: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
}

/**
 * 상황극 문장 연습 훅
 * - 문장 작성
 * - 아바타가 문장 읽어주기
 * - 3회 녹음 연습
 */
export const useSituationPractice = ({
  onPracticeComplete,
}: UseSituationPracticeProps = {}): UseSituationPracticeReturn => {
  const maxPracticeCount = 3;

  // 상태
  const [sentence, setSentence] = useState('');
  const [practiceCount, setPracticeCount] = useState(0);
  const [recordings, setRecordings] = useState<PracticeRecording[]>([]);

  // 아바타 훅
  const avatar = useHeygenAvatar({
    callbacks: {
      onAvatarStartTalking: () => {
        logger.log('[PRACTICE] 아바타 말하기 시작');
      },
      onAvatarStopTalking: () => {
        logger.log('[PRACTICE] 아바타 말하기 종료');
      },
    },
  });

  // 오디오 녹음
  const audioRecorder = useAudioRecorder();

  // 아바타 말하는 중 여부
  const isSpeaking = avatar.avatarState === 'speaking';

  /**
   * 아바타 세션 시작
   */
  const startSession = useCallback(async () => {
    try {
      logger.log('[PRACTICE] 아바타 세션 시작');
      await avatar.startSession();
      logger.log('[PRACTICE] 아바타 세션 준비 완료');
    } catch (error) {
      logger.error('[PRACTICE] 아바타 세션 시작 실패:', error);
      throw error;
    }
  }, [avatar]);

  /**
   * 아바타가 문장 읽어주기
   */
  const speakSentence = useCallback(async () => {
    if (!sentence || sentence.trim() === '') {
      logger.warn('[PRACTICE] 문장이 비어있습니다');
      alert('문장을 입력해주세요.');
      return;
    }

    if (!avatar.isSessionReady) {
      logger.warn('[PRACTICE] 아바타 세션이 준비되지 않았습니다');
      alert('아바타가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (isSpeaking) {
      logger.warn('[PRACTICE] 이미 재생 중입니다');
      return;
    }

    try {
      logger.log('[PRACTICE] 아바타 말하기 시작', { sentence });

      await avatar.speak({
        text: sentence,
        taskType: TaskType.REPEAT,
      });
    } catch (error) {
      logger.error('[PRACTICE] 아바타 말하기 실패:', error);
      alert('아바타 음성 재생에 실패했습니다.\n\nHeyGen API 크레딧을 확인해주세요.');
    }
  }, [sentence, isSpeaking, avatar]);

  /**
   * 녹음 시작
   */
  const startRecording = useCallback(async () => {
    if (practiceCount >= maxPracticeCount) {
      logger.warn('[PRACTICE] 최대 연습 횟수 도달');
      return;
    }

    if (isSpeaking) {
      logger.warn('[PRACTICE] TTS 재생 중에는 녹음할 수 없습니다');
      alert('아바타가 말하는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    try {
      logger.log('[PRACTICE] 녹음 시작', { attempt: practiceCount + 1 });
      await audioRecorder.startRecording();
    } catch (error) {
      logger.error('[PRACTICE] 녹음 시작 실패:', error);

      if (error instanceof Error && error.message.includes('Permission denied')) {
        alert(
          '마이크 권한이 필요합니다.\n\n브라우저 주소창 왼쪽의 자물쇠 아이콘을 클릭하여\n마이크 권한을 "허용"으로 변경해주세요.',
        );
      } else {
        alert('녹음을 시작할 수 없습니다. 다시 시도해주세요.');
      }

      throw error;
    }
  }, [practiceCount, isSpeaking, audioRecorder, maxPracticeCount]);

  /**
   * 녹음 중지 및 저장
   */
  const stopRecording = useCallback(async () => {
    try {
      logger.log('[PRACTICE] 녹음 중지');

      const audioBlob = await audioRecorder.stopRecording();
      if (!audioBlob) {
        throw new Error('녹음 데이터가 없습니다');
      }

      const newRecording: PracticeRecording = {
        attemptNumber: practiceCount + 1,
        audioBlob,
        timestamp: Date.now(),
      };

      setRecordings((prev) => [...prev, newRecording]);
      setPracticeCount((prev) => prev + 1);

      logger.log('[PRACTICE] 녹음 저장 완료', {
        attemptNumber: practiceCount + 1,
        size: audioBlob.size,
      });

      // 3회 완료 시 콜백 호출
      if (practiceCount + 1 >= maxPracticeCount) {
        logger.log('[PRACTICE] 연습 완료 (3회)');
        if (onPracticeComplete) {
          onPracticeComplete();
        }
      }
    } catch (error) {
      logger.error('[PRACTICE] 녹음 저장 실패:', error);
      throw error;
    }
  }, [practiceCount, audioRecorder, onPracticeComplete, maxPracticeCount]);

  /**
   * 초기화
   */
  const reset = useCallback(() => {
    logger.log('[PRACTICE] 연습 초기화');

    setSentence('');
    setPracticeCount(0);
    setRecordings([]);
  }, []);

  return {
    // 상태
    sentence,
    practiceCount,
    recordings,
    isRecording: audioRecorder.isRecording,
    isSpeaking,
    maxPracticeCount,

    // 아바타
    videoRef: avatar.videoRef,
    isSessionReady: avatar.isSessionReady,
    avatarState: avatar.avatarState,
    avatarError: avatar.error,

    // 액션
    setSentence,
    startSession,
    speakSentence,
    startRecording,
    stopRecording,
    reset,
  };
};
