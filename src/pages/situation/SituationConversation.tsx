import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSituationConversation } from '@/hooks/situation/useSituationConversation';
import { useSituationSessionStore } from '@/stores/useSituationSessionStore';
import { TurnIndicator, AvatarVideo, RecordButton } from '@/components/situation/common';
import { ConversationList } from '@/components/situation/conversation';
import { FailureModal } from '@/components/situation/feedback';
import { Toast } from '@/components/common/Toast';
import { useToast } from '@/hooks/common/useToast';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import type { Turn, FinalSummary } from '@/types/situation';
import { logger } from '@/utils/common/loggerUtils';

/**
 * 상황극 대화 페이지
 */
export default function SituationConversation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { situationId } = useParams<{ situationId: string }>();
  const situationIdNum = situationId ? parseInt(situationId, 10) : 0;

  // location state에서 상황극 이름 가져오기
  const situationName = location.state?.situationName as string | undefined;

  // 실패 모달 상태
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [failedTurn, setFailedTurn] = useState<Turn | null>(null);

  // 세션 재개 버튼 표시 상태
  const [showResumeButton, setShowResumeButton] = useState(false);

  // 토스트
  const toast = useToast();

  // 대화 관리
  const conversation = useSituationConversation({
    situationId: situationIdNum,
    onSessionEnd: (finalSummary: FinalSummary, turns: Turn[]) => {
      logger.log('[PAGE] 세션 종료, 피드백 페이지로 이동', { finalSummary, turnsCount: turns.length });
      // 세션 데이터 클리어 (정상 완료)
      clearSession();
      logger.log('[PAGE] 세션 데이터 클리어 완료');
      // 피드백 페이지로 이동하면서 데이터 전달 (업데이트된 대화 히스토리 포함)
      navigate(`/situation/${situationIdNum}/feedback`, {
        state: { finalSummary, turns },
      });
    },
    onEvaluationFailed: (turn: Turn) => {
      logger.log('[PAGE] 평가 실패, 모달 표시', turn);
      setFailedTurn(turn);
      setIsFailureModalOpen(true);
    },
  });

  // 뒤로가기
  const handleBack = () => {
    if (conversation.sessionId) {
      const confirmLeave = window.confirm('대화를 종료하시겠습니까? 진행 중인 내용은 저장되지 않습니다.');
      if (!confirmLeave) return;

      conversation.endConversation().catch(logger.error);
      // 세션 데이터 클리어 (사용자가 명시적으로 종료)
      clearSession();
      logger.log('[PAGE] 세션 데이터 클리어 완료 (뒤로가기)');
    }
    navigate(-1);
  };

  // Store에서 세션 관련 함수 및 상태 가져오기 (개별 구독으로 무한 루프 방지)
  const savedSessionId = useSituationSessionStore((state) => state.sessionId);
  const savedTurns = useSituationSessionStore((state) => state.turns);
  const savedTurnIndex = useSituationSessionStore((state) => state.currentTurnIndex);
  const savedCurrentQuestion = useSituationSessionStore((state) => state.currentQuestion);
  const shouldRestoreSession = useSituationSessionStore((state) => state.shouldRestoreSession);
  const saveSession = useSituationSessionStore((state) => state.saveSession);
  const clearSession = useSituationSessionStore((state) => state.clearSession);
  const setShouldRestore = useSituationSessionStore((state) => state.setShouldRestore);

  // 학습하기 버튼 클릭
  const handleLearn = async () => {
    setIsFailureModalOpen(false);

    // 세션 상태 저장 (학습 후 복귀를 위해)
    if (conversation.sessionId && failedTurn) {
      saveSession({
        sessionId: conversation.sessionId,
        situationId: situationIdNum,
        situationName: situationName || '',
        currentTurnIndex: conversation.currentTurnIndex,
        turns: conversation.turns,
        currentQuestion: failedTurn.nextQuestion || failedTurn.question,
      });
      logger.log('[PAGE] 세션 상태 저장 완료');
    }

    // 아바타 세션만 종료 (백엔드 세션은 유지)
    try {
      await conversation.stopAvatarSession();
    } catch (error) {
      logger.error('아바타 세션 종료 실패:', error);
    }

    navigate(`/situation/${situationIdNum}/practice`, {
      state: { failedTurn, situationName },
    });
  };

  // 다시하기 버튼 클릭
  const handleRetry = async () => {
    setIsFailureModalOpen(false);
    setFailedTurn(null);
    // 현재 턴 다시하기 (아바타 격려 메시지)
    await conversation.retryCurrentTurn();
  };

  // 새 세션 시작 핸들러 (이전 데이터 클리어)
  const handleStartSession = async () => {
    // 새 세션 시작 전 이전 세션 데이터 클리어
    clearSession();
    logger.log('[PAGE] 세션 데이터 클리어 완료 (새 세션 시작)');
    await conversation.startConversation();
  };

  // 녹음 버튼 활성화 조건
  const isRecordButtonDisabled =
    !conversation.isSessionReady ||
    conversation.isProcessing ||
    conversation.avatarState === 'speaking' ||
    conversation.currentTurnIndex === 0;

  // 녹음 시작 핸들러 (토스트 추가)
  const handleStartRecording = async () => {
    toast.showToast('녹음을 시작합니다');
    await conversation.startRecording();
  };

  // 녹음 종료 핸들러 (토스트 추가)
  const handleStopRecording = async () => {
    toast.showToast('녹음이 완료되었습니다');
    await conversation.stopRecording();
  };

  // 세션 재개 핸들러 (사용자 클릭으로 세션 복원)
  const handleResumeSession = async () => {
    if (!savedSessionId || !savedCurrentQuestion) {
      logger.error('[PAGE] 세션 복원 데이터가 없습니다');
      toast.showToast('세션 복원에 실패했습니다');
      setShowResumeButton(false);
      return;
    }

    try {
      setShowResumeButton(false);
      logger.log('[PAGE] 사용자가 세션 재개 버튼 클릭');

      // 저장된 세션 상태 복원 (백엔드 세션 유지, 아바타만 재시작)
      await conversation.restoreSession(savedSessionId, savedTurns, savedTurnIndex, savedCurrentQuestion);

      // 복원 플래그 초기화
      setShouldRestore(false);
      logger.log('[PAGE] 세션 복원 완료');
    } catch (error) {
      logger.error('[PAGE] 세션 복원 실패:', error);
      toast.showToast('세션 복원에 실패했습니다');
      setShowResumeButton(false);
    }
  };

  // 학습 페이지에서 복귀 시 세션 재개 버튼 표시
  useEffect(() => {
    const fromPractice = location.state?.fromPractice;

    if (fromPractice && shouldRestoreSession && savedSessionId && savedCurrentQuestion) {
      logger.log('[PAGE] 학습 페이지에서 복귀, 세션 재개 버튼 표시', {
        sessionId: savedSessionId,
        turnIndex: savedTurnIndex,
        turnsCount: savedTurns.length,
        currentQuestion: savedCurrentQuestion,
      });

      // 세션 재개 버튼 표시 (자동 복원하지 않음)
      setShowResumeButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRestoreSession, savedSessionId, savedTurnIndex, savedCurrentQuestion]);

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 상단 헤더 */}
      <div className="h-16 w-full shrink-0 overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            aria-label="뒤로가기"
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </button>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">{situationName || '상황극 대화'}</p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 턴 표시 (FreeTalk 스타일) */}
        <TurnIndicator
          currentTurn={conversation.currentTurnIndex}
          totalTurns={5}
          completedTurns={conversation.turns.filter((t) => t.answer).map((t) => t.turnIndex)}
        />

        {/* 세션 재개 모달 */}
        {showResumeButton && (
          <div className="mx-4 mt-4 rounded-lg bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-3">
              <p className="text-body-01-semibold text-center text-gray-100">학습을 마치고 돌아오셨네요!</p>
              <button
                onClick={handleResumeSession}
                className="bg-blue-1 hover:bg-blue-2 cursor-pointer rounded-lg py-2 text-white transition-colors"
              >
                <span className="text-body-02-semibold">세션 재개하기</span>
              </button>
            </div>
          </div>
        )}

        {/* 아바타 비디오 */}
        <div className="shrink-0 px-4 pb-6">
          <AvatarVideo
            videoRef={conversation.videoRef}
            isSessionReady={conversation.isSessionReady}
            avatarState={conversation.avatarState}
            avatarError={conversation.avatarError}
            onStartSession={handleStartSession}
          />
        </div>

        {/* 대화 목록 */}
        <ConversationList
          turns={conversation.turns}
          currentTurnIndex={conversation.currentTurnIndex}
          isProcessing={conversation.isProcessing}
        />
      </div>

      {/* 하단 녹음 버튼 */}
      <div className="flex shrink-0 justify-center py-3">
        <RecordButton
          isRecording={conversation.isRecording}
          isDisabled={isRecordButtonDisabled}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          size="large"
        />
      </div>

      {/* 세션 재개 버튼 오버레이 */}
      {showResumeButton && (
        <div className="bg-opacity-80 absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center gap-2">
              <p className="text-heading-02-semibold text-gray-100">대화를 계속하시겠습니까?</p>
              <p className="text-body-02-regular text-gray-60 text-center">
                학습을 마치고 돌아오셨네요!
                <br />
                이전 대화를 이어서 진행하세요
              </p>
            </div>
            <button
              onClick={handleResumeSession}
              className="bg-blue-1 hover:bg-blue-2 cursor-pointer rounded-lg px-8 py-3 text-white transition-colors"
            >
              <span className="text-body-01-semibold">세션 재개하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 학습 감지 모달 */}
      <FailureModal isOpen={isFailureModalOpen} onRetry={handleRetry} onLearn={handleLearn} />

      {/* 토스트 */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={toast.hideToast} />
    </div>
  );
}
