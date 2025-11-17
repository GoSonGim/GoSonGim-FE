import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1Layout from '@/components/talkingkit/layout/Step1Layout';
import TimerProgressBar from '@/components/talkingkit/progressBar/TimerProgressBar';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import BreathAnimation from '@/assets/svgs/talkingkit/breathing/breathanimation.svg';
import { useKitDetail } from '@/hooks/talkingkit/queries/useKitDetail';

type Phase = 'ready' | 'playing' | 'complete';

const SteadySound = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('ready');
  const { data: kitDetail, error } = useKitDetail(2); // kitId: 2 (일정한 소리내기)

  // API 응답 데이터 콘솔 출력
  useEffect(() => {
    if (kitDetail) {
      console.log('일정한 소리내기 키트 상세 정보 API 응답:', kitDetail);
      console.log('키트 ID:', kitDetail.result.kitId);
      console.log('키트 이름:', kitDetail.result.kitName);
      console.log('키트 카테고리:', kitDetail.result.kitCategory);
      console.log('총 단계 수:', kitDetail.result.totalStages);
      console.log('단계 목록:', kitDetail.result.stages);
    }
  }, [kitDetail]);

  useEffect(() => {
    if (error) {
      console.error('일정한 소리내기 키트 상세 정보 조회 실패:', error);
    }
  }, [error]);

  // API에서 받아온 1단계 이름 (stageId: 1)
  const stage1Name: string =
    kitDetail?.result.stages.find((stage) => stage.stageId === 1)?.stageName || '복식 호흡 연습';

  const handleStart = () => {
    setPhase('playing');
  };

  const handleTimerComplete = () => {
    setPhase('complete');
  };

  const handleBack = () => {
    navigate('/talkingkit');
  };

  const handleNext = () => {
    navigate('/talkingkit/2/short-sound');
  };

  // 시작 전 화면
  if (phase === 'ready') {
    return (
      <Step1Layout
        headerTitle="일정한 소리 내기"
        title={stage1Name}
        showAction={true}
        guideText="영상의 움직임에 따라 호흡을 진행하세요"
        buttonText="시작하기"
        onButtonClick={handleStart}
        onBackClick={handleBack}
      >
        <div className="flex h-[352px] items-center justify-center">
          <BreathAnimation className="h-auto w-[248px]" />
        </div>
      </Step1Layout>
    );
  }

  // 진행 중 화면
  if (phase === 'playing') {
    return (
      <div className="bg-background-primary relative flex h-full flex-col">
        <Step1Layout
          headerTitle="일정한 소리 내기"
          title={stage1Name}
          showAction={false}
          onBackClick={handleBack}
          disableAnimation={true}
        >
          <div className="flex h-[352px] items-center justify-center">
            <BreathAnimation className="h-auto w-[248px]" />
          </div>
        </Step1Layout>

        {/* 하단 타이머 진행바 */}
        <div className="absolute right-0 bottom-0 left-0 z-50 px-[29px] pb-[40px]">
          <TimerProgressBar duration={6000} onComplete={handleTimerComplete} />
        </div>
      </div>
    );
  }

  // 완료 화면
  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      <Step1Layout headerTitle="일정한 소리 내기" title={stage1Name} onBackClick={handleBack}>
        <div className="flex h-[352px] w-full items-center justify-center">
          <h1 className="text-[48px] leading-normal font-medium text-[#ff1f1f]">GREAT!</h1>
        </div>
      </Step1Layout>

      {/* 다음 진행하기 버튼 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <AnimatedContainer variant="fadeIn" delay={0.3}>
          <button
            onClick={handleNext}
            className="text-heading-02-semibold border-blue-1 text-gray-80 h-12 w-72 cursor-pointer rounded-full border bg-white transition-colors hover:bg-blue-50"
          >
            다음 진행하기
          </button>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default SteadySound;
