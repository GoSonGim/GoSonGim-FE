import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSituationPractice } from '@/hooks/situation/useSituationPractice';
import { PracticeSession } from '@/components/situation/practice';
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
  const situationName = location.state?.situationName as string | undefined;

  // 연습 단계 상태
  const [step, setStep] = useState<'input' | 'practice' | 'complete'>('input');
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

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
      setShowPlaceholder(false); // 값이 있으면 placeholder 숨김
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
          <p className="text-heading-02-regular text-gray-100">{situationName || '문장 연습'}</p>
        </div>
      </div>

      {step === 'input' && (
        // 1단계: 문장 작성
        <div className="flex flex-1 flex-col">
          {/* 아바타 영상 플레이스홀더 */}
          <div className="mx-[14px] mt-6 flex h-[224px] items-center justify-center overflow-hidden rounded-[16px] bg-white px-[56px] py-[56px]">
            <p className="text-body-01-medium text-blue-1 text-center">
              말씀하시려던 문장을 작성하고 <br /> 시작하기 버튼을 눌러주세요.
            </p>
          </div>

          {/* 입력 필드 */}
          <div className="mx-4 mt-3 mb-[203px]">
            <input
              type="text"
              value={practice.sentence}
              onChange={(e) => {
                const newValue = e.target.value;
                practice.setSentence(newValue);
                // 값이 있으면 placeholder 숨김, 없으면 표시
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
              className="text-body-01-regular placeholder:text-gray-40 border-blue-1 h-[60px] w-full rounded-[16px] border border-solid px-4 text-center text-gray-100 focus:outline-none"
            />
          </div>

          {/* 피드백 표시 (실패한 경우) */}
          {failedTurn?.evaluation && (
            <div className="mx-4 mt-4 rounded-[16px] bg-red-50 p-4">
              <p className="text-caption-01-semibold mb-1 text-red-500">평가 피드백</p>
              <p className="text-body-02-regular text-gray-80">{failedTurn.evaluation.feedback}</p>
            </div>
          )}

          {/* 하단 고정 버튼 */}
          <div className="absolute right-[52px] bottom-[78px] left-[53px]">
            <button
              onClick={handleStartPractice}
              disabled={!practice.sentence || practice.sentence.trim() === ''}
              className="bg-blue-1 hover:bg-blue-1-hover text-heading-02-semibold cusror-pointer disabled:bg-gray-20 disabled:text-gray-60 h-[48px] w-full cursor-pointer rounded-[100px] text-white transition-colors disabled:cursor-not-allowed"
            >
              시작하기
            </button>
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
              onStartRecording={practice.startRecording}
              onStopRecording={practice.stopRecording}
            />
          </div>
        </div>
      )}

      {step === 'complete' && (
        // 3단계: 완료
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <div className="text-6xl">🎉</div>

          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-heading-01-bold text-gray-100">연습 완료!</h2>
            <p className="text-body-01-regular text-gray-60">문장 연습을 모두 마쳤습니다.</p>
          </div>

          {showCompleteMessage && (
            <div className="bg-blue-1/10 w-full rounded-[12px] p-4">
              <p className="text-body-01-medium text-blue-1 text-center">
                다시 시작하기 버튼을 눌러
                <br />
                대화를 이어가세요!
              </p>
            </div>
          )}

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={handleRestart}
              className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold h-[56px] cursor-pointer rounded-[8px] text-white transition-colors"
            >
              다시 시작하기
            </button>
            <button
              onClick={handleBack}
              className="text-body-01-semibold border-gray-20 text-gray-80 hover:bg-gray-10 h-[56px] rounded-[8px] border border-solid transition-colors"
            >
              나가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
