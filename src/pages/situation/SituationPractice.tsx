import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSituationPractice } from '@/hooks/situation/useSituationPractice';
import { useSituationSessionStore } from '@/stores/useSituationSessionStore';
import { PracticeSession } from '@/components/situation/practice';
import { AvatarVideo } from '@/components/situation/common';
import { Toast } from '@/components/common/Toast';
import { useToast } from '@/hooks/common/useToast';
import Modal, { ModalButton } from '@/components/common/Modal';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import type { Turn } from '@/types/situation';
import { logger } from '@/utils/common/loggerUtils';

/**
 * 상황극 문장 연습 페이지
 */
export default function SituationPractice() {
  const navigate = useNavigate();
  const { situationId } = useParams<{ situationId: string }>();
  const location = useLocation();
  const situationIdNum = situationId ? parseInt(situationId, 10) : 0;

  // 실패한 턴 데이터 (대화 페이지에서 전달)
  const failedTurn = location.state?.failedTurn as Turn | undefined;
  const situationName = location.state?.situationName as string | undefined;

  // 연습 단계 상태
  const [step, setStep] = useState<'input' | 'practice' | 'complete'>('input');
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // 토스트
  const toast = useToast();

  // Store에서 세션 복원 플래그 설정 함수 가져오기
  const setShouldRestore = useSituationSessionStore((state) => state.setShouldRestore);

  const practice = useSituationPractice({
    onPracticeComplete: () => {
      logger.log('[PRACTICE] 3회 연습 완료');
      setStep('complete');
    },
  });

  // 초기 문장 설정 (실패한 답변이 있으면 자동 입력)
  useEffect(() => {
    if (failedTurn?.answer) {
      practice.setSentence(failedTurn.answer);
      setShowPlaceholder(false); // 값이 있으면 placeholder 숨김
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failedTurn]); // practice를 제거하여 무한 루프 방지

  // 뒤로가기
  const handleBack = () => {
    if (practice.practiceCount > 0) {
      const confirmLeave = window.confirm('연습을 중단하시겠습니까?');
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  // 녹음 시작 핸들러
  const handleStartRecording = async () => {
    toast.showToast('녹음을 시작합니다');
    await practice.startRecording();
  };

  // 녹음 종료 핸들러
  const handleStopRecording = async () => {
    toast.showToast('녹음이 완료되었습니다');
    await practice.stopRecording();
  };

  // 연습 시작
  const handleStartPractice = () => {
    if (!practice.sentence || practice.sentence.trim() === '') {
      alert('문장을 입력해주세요.');
      return;
    }

    logger.log('[PRACTICE] practice 단계로 전환');
    // 아바타 세션은 시작하지 않고 단계만 전환
    setStep('practice');
  };

  // 다시 시작하기 (대화 페이지로 복귀, 저장된 세션 복원)
  const handleRestart = () => {
    logger.log('[PRACTICE] 다시 시작하기 - 대화 페이지로 복귀');

    // 세션 복원 플래그 설정
    setShouldRestore(true);

    // 대화 페이지로 이동하면서 fromPractice 플래그 전달
    navigate(`/situation/${situationIdNum}/conversation`, {
      state: { fromPractice: true, situationName },
    });
  };

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
          <p className="text-heading-02-regular text-gray-100">{situationName || '문장 연습'}</p>
        </div>
      </div>

      {step === 'input' && (
        // 1단계: 문장 작성
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 아바타 영상 플레이스홀더 */}
          <div className="shrink-0 px-4 pt-6 pb-6">
            <div className="bg-gray-20 relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-[16px] shadow-lg">
              {/* 로딩 스피너 */}
              <div className="border-blue-1 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex w-full flex-col gap-6">
              {/* 문장 입력 */}
              <div className="border-blue-1 rounded-[16px] border border-solid bg-white p-2 shadow-lg">
                <input
                  type="text"
                  value={practice.sentence}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    practice.setSentence(newValue);
                    setShowPlaceholder(!newValue || newValue.trim() === '');
                  }}
                  placeholder={showPlaceholder ? '말씀하시려던 문장을 작성해주세요' : ''}
                  maxLength={100}
                  onFocus={() => setShowPlaceholder(false)}
                  onBlur={() => {
                    if (!practice.sentence || practice.sentence.trim() === '') {
                      setShowPlaceholder(true);
                    }
                  }}
                  className="text-body-01-regular text-gray-80 placeholder:text-gray-40 w-full resize-none border-0 bg-transparent px-2 py-3 text-center focus:outline-none"
                />
              </div>

              {/* 안내 문구 */}
              <div className="text-center">
                <p className="text-body-01-regular text-blue-1">
                  말씀하시려던 문장을 작성하고
                  <br />
                  시작하기 버튼을 눌러주세요.
                </p>
              </div>

              {/* 피드백 표시 (실패한 경우) */}
              {failedTurn?.evaluation && (
                <div className="rounded-[16px] bg-white p-5 shadow-lg">
                  <p className="text-caption-01-semibold mb-2 text-red-500">평가 피드백</p>
                  <p className="text-body-02-regular text-gray-80">{failedTurn.evaluation.feedback}</p>
                </div>
              )}

              {/* 시작하기 버튼 */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleStartPractice}
                  disabled={!practice.sentence || practice.sentence.trim() === ''}
                  className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold disabled:bg-gray-20 disabled:text-gray-60 h-[48px] w-full max-w-[200px] cursor-pointer rounded-[8px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'practice' && (
        // 2단계: 3회 연습
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 아바타 비디오 */}
          <div className="shrink-0 px-4 pb-6">
            <AvatarVideo
              videoRef={practice.videoRef}
              isSessionReady={practice.isSessionReady}
              avatarState={practice.avatarState}
              avatarError={practice.avatarError}
              onStartSession={practice.startSession}
            />
          </div>

          {/* 연습 세션 */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <PracticeSession
              sentence={practice.sentence}
              practiceCount={practice.practiceCount}
              maxPracticeCount={practice.maxPracticeCount}
              isRecording={practice.isRecording}
              isSpeaking={practice.isSpeaking}
              onSpeak={practice.speakSentence}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onSentenceChange={practice.setSentence}
            />
          </div>
        </div>
      )}

      {/* 토스트 */}
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={toast.hideToast} />

      {/* 연습 완료 모달 */}
      <Modal isOpen={step === 'complete'} onClose={handleBack} hideCloseOnBackdrop>
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🎉</div>
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-body-01-semibold text-gray-100">연습 완료!</h2>
              <p className="text-body-02-regular text-gray-60">문장 연습을 모두 마쳤습니다.</p>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <ModalButton onClick={handleBack} variant="secondary">
              나가기
            </ModalButton>
            <ModalButton onClick={handleRestart} variant="primary">
              상황극 복귀하기
            </ModalButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
