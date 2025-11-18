import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSituationPractice } from '@/hooks/situation/useSituationPractice';
import { SentenceInput, PracticeSession } from '@/components/situation/practice';
import { AvatarVideo } from '@/components/situation/common';
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

  // 연습 단계 상태
  const [step, setStep] = useState<'input' | 'practice' | 'complete'>('input');
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);

  const practice = useSituationPractice({
    onPracticeComplete: () => {
      logger.log('[PRACTICE] 3회 연습 완료');
      setStep('complete');
      setShowCompleteMessage(true);
    },
  });

  // 초기 문장 설정 (실패한 답변이 있으면 자동 입력)
  useEffect(() => {
    if (failedTurn?.answer) {
      practice.setSentence(failedTurn.answer);
    }
  }, [failedTurn, practice]);

  // 뒤로가기
  const handleBack = () => {
    if (practice.practiceCount > 0) {
      const confirmLeave = window.confirm('연습을 중단하시겠습니까?');
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  // 연습 시작
  const handleStartPractice = async () => {
    if (!practice.sentence || practice.sentence.trim() === '') {
      alert('문장을 입력해주세요.');
      return;
    }

    try {
      logger.log('[PRACTICE] 아바타 세션 시작 중...');
      await practice.startSession();
      setStep('practice');
    } catch (error) {
      logger.error('[PRACTICE] 아바타 세션 시작 실패:', error);
      alert('아바타 세션을 시작할 수 없습니다. 다시 시도해주세요.');
    }
  };

  // 다시 시작하기 (대화 페이지로 복귀, 세션은 유지하고 대화만 리셋)
  const handleRestart = () => {
    logger.log('[PRACTICE] 다시 시작하기 - 대화 페이지로 복귀');
    navigate(`/situation/${situationIdNum}/conversation`);
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
          <p className="text-heading-02-regular text-gray-100">문장 연습</p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        {step === 'input' && (
          // 1단계: 문장 작성
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-heading-02-semibold text-gray-100">연습할 문장을 작성하세요</h2>
              <p className="text-body-02-regular text-gray-60">작성한 문장을 3번 따라 읽어보세요.</p>
            </div>

            {/* 피드백 표시 (실패한 경우) */}
            {failedTurn?.evaluation && (
              <div className="rounded-[12px] bg-red-50 p-4">
                <p className="text-caption-01-semibold mb-1 text-red-500">평가 피드백</p>
                <p className="text-body-02-regular text-gray-80">{failedTurn.evaluation.feedback}</p>
              </div>
            )}

            <SentenceInput value={practice.sentence} onChange={practice.setSentence} maxLength={100} />

            <button
              onClick={handleStartPractice}
              disabled={!practice.sentence || practice.sentence.trim() === ''}
              className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold disabled:bg-gray-20 disabled:text-gray-60 h-12 rounded-[8px] text-white transition-colors disabled:cursor-not-allowed"
            >
              연습 시작
            </button>
          </div>
        )}

        {step === 'practice' && (
          // 2단계: 3회 연습
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-heading-02-semibold text-gray-100">문장을 따라 읽어보세요</h2>
              <p className="text-body-02-regular text-gray-60">
                아바타를 보며 문장을 듣고, 녹음 버튼을 눌러 3번 따라해보세요.
              </p>
            </div>

            {/* 아바타 비디오 */}
            <div className="shrink-0">
              <AvatarVideo
                videoRef={practice.videoRef}
                isSessionReady={practice.isSessionReady}
                avatarState={practice.avatarState}
                avatarError={practice.avatarError}
                onStartSession={practice.startSession}
              />
            </div>

            <PracticeSession
              sentence={practice.sentence}
              practiceCount={practice.practiceCount}
              maxPracticeCount={practice.maxPracticeCount}
              isRecording={practice.isRecording}
              isSpeaking={practice.isSpeaking}
              onSpeak={practice.speakSentence}
              onStartRecording={practice.startRecording}
              onStopRecording={practice.stopRecording}
            />
          </div>
        )}

        {step === 'complete' && (
          // 3단계: 완료
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="text-6xl">🎉</div>

            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-heading-01-bold text-gray-100">연습 완료!</h2>
              <p className="text-body-01-regular text-gray-60">문장 연습을 모두 마쳤습니다.</p>
            </div>

            {showCompleteMessage && (
              <div className="bg-blue-1/10 w-full max-w-[400px] rounded-[12px] p-4">
                <p className="text-body-01-medium text-blue-1 text-center">
                  다시 시작하기 버튼을 눌러
                  <br />
                  대화를 이어가세요!
                </p>
              </div>
            )}

            <div className="flex w-full max-w-[400px] flex-col gap-3">
              <button
                onClick={handleRestart}
                className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold h-12 rounded-[8px] text-white transition-colors"
              >
                다시 시작하기
              </button>
              <button
                onClick={handleBack}
                className="text-body-01-semibold border-gray-20 text-gray-80 hover:bg-gray-10 h-12 rounded-[8px] border border-solid transition-colors"
              >
                나가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
