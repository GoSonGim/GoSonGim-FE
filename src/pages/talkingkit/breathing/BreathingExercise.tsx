import { useParams, useNavigate } from 'react-router-dom';
import { useBreathingAnimation } from '@/hooks/talkingkit/breathing/useBreathingAnimation';
import BreathingGraph from '@/components/talkingkit/breathing/BreathingGraph';
import TimerProgressBar from '@/components/talkingkit/progressBar/TimerProgressBar';
import { kitsData } from '@/mock/talkingkit/kitsData';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import Step1Layout from '@/components/talkingkit/layout/Step1Layout';
import { logger } from '@/utils/loggerUtils';

const BreathingExercise = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { phase, ballPosition, start, reset, setBluePathRef, setRedPathRef } = useBreathingAnimation();

  // 키트 정보 가져오기
  const kit = kitsData.find((k) => k.id === Number(id));

  if (!kit) {
    navigate('/talkingkit');
    return null;
  }

  const handleStart = () => {
    logger.log('🚀 애니메이션 시작');
    reset();
    start();
  };

  const handleNext = () => {
    logger.log('➡️ 다음 페이지로 이동');
    // vowel-pitch 페이지로 이동
    navigate('/talkingkit/vowel-pitch');
  };

  // 완료 화면 (GREAT!)
  if (phase === 'complete') {
    return (
      <div className="bg-background-primary relative flex h-full flex-col">
        <Step1Layout
          headerTitle={`${kit.highlightedText} 소리내기`}
          title="환경과 호흡 연습"
          onBackClick={() => navigate('/talkingkit')}
        >
          <div className="flex h-[352px] w-full items-center justify-center">
            <h1 className="text-[48px] leading-normal font-medium text-[#ff1f1f]">GREAT!</h1>
          </div>
        </Step1Layout>

        {/* 다음 진행하기 버튼 - 절대 위치 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <AnimatedContainer variant="fadeIn" delay={0.3}>
            <button
              onClick={handleNext}
              className="text-heading-02-semibold border-blue-1 text-gray-80 h-12 w-72 rounded-full border bg-white transition-colors hover:bg-blue-50"
            >
              다음 진행하기
            </button>
          </AnimatedContainer>
        </div>
      </div>
    );
  }

  // 시작 전 화면
  if (phase === 'ready') {
    return (
      <Step1Layout
        headerTitle={`${kit.highlightedText} 소리내기`}
        title="환경과 호흡 연습"
        showAction={true}
        guideText="공의 움직임에 따라 호흡을 진행하세요"
        buttonText="시작하기"
        onButtonClick={handleStart}
        onBackClick={() => navigate('/talkingkit')}
      >
        <div className="flex h-[352px] items-center justify-center">
          <BreathingGraph
            phase={phase}
            ballPosition={ballPosition}
            setBluePathRef={setBluePathRef}
            setRedPathRef={setRedPathRef}
          />
        </div>
      </Step1Layout>
    );
  }

  // 진행 중 화면 (inhale, exhale)
  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      <Step1Layout
        headerTitle={`${kit.highlightedText} 소리내기`}
        title="환경과 호흡 연습"
        onBackClick={() => navigate('/talkingkit')}
        disableAnimation={true}
      >
        <div className="flex h-[352px] items-center justify-center">
          <BreathingGraph
            phase={phase}
            ballPosition={ballPosition}
            setBluePathRef={setBluePathRef}
            setRedPathRef={setRedPathRef}
          />
        </div>
      </Step1Layout>

      {/* 진행 중 안내 텍스트 - Figma 기준 위치 */}
      <div className="absolute top-[444px] left-1/2 -translate-x-1/2">
        <div className="text-center">
          {phase === 'inhale' && <p className="text-heading-02-semibold text-blue-1">숨 들이마시기</p>}
          {phase === 'exhale' && <p className="text-heading-02-semibold text-red-500">숨 내쉬기</p>}
        </div>
      </div>

      {/* 하단 타이머 진행바 - 페이지 최하단에 고정 */}
      <div className="absolute right-0 bottom-0 left-0 z-50 px-[29px] pb-[40px]">
        <TimerProgressBar duration={10000} />
      </div>
    </div>
  );
};

export default BreathingExercise;
