import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Step1Layout from '@/components/talkingkit/layout/Step1Layout';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import GraybigCircle from '@/assets/svgs/talkingkit/loudSound/biggraycircle.svg';
import BlueRing from '@/assets/svgs/talkingkit/loudSound/bluering.svg';
import { useLoudSound } from '@/hooks/talkingkit/loudSound/useLoudSound';
import { useKitDetail } from '@/hooks/talkingkit/queries/useKitDetail';

const LoudSound = () => {
  const navigate = useNavigate();
  const { phase, activeText, ringScale, start } = useLoudSound();
  const { data: kitDetail } = useKitDetail(3); // kitId: 3 (큰 소리 내기)

  // API에서 받아온 1단계 이름 (stageId: 1)
  const stage1Name: string =
    kitDetail?.result.stages.find((stage) => stage.stageId === 1)?.stageName || '호흡 세게 뱉기';

  const handleStart = () => {
    start();
  };

  const handleBack = () => {
    navigate('/talkingkit');
  };

  const handleNext = () => {
    navigate('/talkingkit/3/loud-sound-volume');
  };

  // 완료 화면
  if (phase === 'complete') {
    return (
      <div className="bg-background-primary relative flex h-full flex-col">
        <Step1Layout headerTitle="큰 소리 내기" title={stage1Name} onBackClick={handleBack}>
          <div className="flex h-[352px] w-full items-center justify-center">
            <h1 className="text-[48px] leading-normal font-medium text-[#ff1f1f]">GREAT!</h1>
          </div>
        </Step1Layout>

        {/* 다음 진행하기 버튼 */}
        <div className="absolute bottom-[149px] left-1/2 -translate-x-1/2">
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
  }

  // 시작 전 또는 진행 중 화면
  return (
    <Step1Layout
      headerTitle="큰 소리 내기"
      title={stage1Name}
      showAction={phase === 'ready'}
      guideText="바람을 불어 원의 테두리를 맞춰보세요"
      buttonText="시작하기"
      onButtonClick={handleStart}
      onBackClick={handleBack}
    >
      <div className="relative flex h-[352px] w-full flex-col items-center justify-center overflow-visible">
        {/* 회색 큰 원 + 파란 링 */}
        <div className="relative flex items-center justify-center overflow-visible p-4">
          <GraybigCircle className="h-[206px] w-[206px]" />
          <motion.div
            className="absolute overflow-visible"
            animate={{ scale: ringScale }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <BlueRing className="z-20 h-[31px] w-[31px]" />
          </motion.div>
        </div>

        {/* 텍스트: | 들숨 후! */}
        <div className="absolute bottom-[32px] flex items-center gap-4 text-[16px]">
          {/* "들숨" */}
          <motion.span
            animate={{
              scale: activeText === 'left' ? 1.2 : 1.0,
            }}
            transition={{ duration: 0.3 }}
            className="text-[20px] leading-[1.2] font-medium text-black"
          >
            들숨
          </motion.span>

          {/* "후!" */}
          <motion.span
            animate={{
              scale: activeText === 'center' ? 1.2 : 1.0,
            }}
            transition={{ duration: 0.3 }}
            className="text-blue-1 text-[20px] leading-[1.2] font-medium"
          >
            후!
          </motion.span>
        </div>
      </div>
    </Step1Layout>
  );
};

export default LoudSound;
