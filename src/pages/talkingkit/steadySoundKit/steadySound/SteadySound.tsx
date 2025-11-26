import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Step1Layout from '@/components/talkingkit/layout/Step1Layout';
import TimerProgressBar from '@/components/talkingkit/progressBar/TimerProgressBar';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import { useKitDetail } from '@/hooks/talkingkit/queries/useKitDetail';
import type { KitStage } from '@/types/talkingkit/kit';
import { logger } from '@/utils/common/loggerUtils';
import breathingVideo from '/videos/breathinganimation.mp4';

type Phase = 'ready' | 'playing' | 'complete';

const SteadySound = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const kitId = id ? parseInt(id, 10) : 2; // fallback to 2 for steady sound kit
  const [phase, setPhase] = useState<Phase>('ready');
  const playCountRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: kitDetail, isLoading, isError, error } = useKitDetail(kitId);

  const getStage = (stageId: number): KitStage | null => {
    if (!kitDetail?.result?.stages) return null;
    return kitDetail.result.stages.find((stage) => stage.stageId === stageId) || null;
  };

  // API 응답 데이터 콘솔 출력
  useEffect(() => {
    if (kitDetail) {
      logger.log('일정한 소리내기 키트 상세 정보 API 응답:', kitDetail);
      logger.log('키트 ID:', kitDetail.result.kitId);
      logger.log('키트 이름:', kitDetail.result.kitName);
      logger.log('키트 카테고리:', kitDetail.result.kitCategory);
      logger.log('총 단계 수:', kitDetail.result.totalStages);
      logger.log('단계 목록:', kitDetail.result.stages);
    }
  }, [kitDetail]);

  useEffect(() => {
    if (error) {
      logger.error('일정한 소리내기 키트 상세 정보 조회 실패:', error);
    }
  }, [error]);

  // phase 변경 시 playCount 초기화
  useEffect(() => {
    if (phase === 'ready') {
      playCountRef.current = 0;
    }
  }, [phase]);

  // playing 단계에서 영상 3번 반복
  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== 'playing') return;

    const handleEnded = () => {
      if (playCountRef.current < 2) {
        // 3번 재생 (0, 1, 2)
        playCountRef.current += 1;
        video.play();
      }
    };

    video.addEventListener('ended', handleEnded);
    video.play();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [phase]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-body-01-regular text-gray-60">로딩 중...</p>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (isError || !kitDetail) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-body-01-regular text-gray-60">키트 정보를 불러올 수 없습니다</p>
        <button onClick={() => navigate(-1)} className="text-body-02-regular text-blue-2">
          돌아가기
        </button>
      </div>
    );
  }

  // API에서 받아온 1단계 이름 (stageId: 1)
  const stage1Name: string = getStage(1)?.stageName || '복식 호흡 연습';

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
        <div className="flex h-[352px] items-center justify-center overflow-hidden">
          <video className="h-auto w-[248px]" src={breathingVideo} muted playsInline />
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
          <div className="flex h-[352px] items-center justify-center overflow-hidden">
            <video ref={videoRef} className="h-auto w-[248px]" src={breathingVideo} muted playsInline />
          </div>
        </Step1Layout>

        {/* 하단 타이머 진행바 */}
        <div className="absolute right-0 bottom-0 left-0 z-50 px-[29px] pb-[40px]">
          <TimerProgressBar duration={12000} onComplete={handleTimerComplete} />
        </div>
      </div>
    );
  }

  // 완료 화면
  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          <div
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            onClick={handleBack}
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>
          <p className="text-heading-02-regular text-gray-100">일정한 소리 내기</p>
        </div>
      </div>

      {/* 상단 진행바 (1단계 활성) */}
      <AnimatedContainer variant="fadeInUpSmall" delay={0} className="px-4 py-3" disabled={false}>
        <div className="flex gap-2">
          <div className="bg-blue-1 h-1 flex-1 rounded-full" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
        </div>
      </AnimatedContainer>

      {/* 본문 */}
      <div className="relative flex flex-1 flex-col items-center px-4 py-4 pb-12">
        <div className="flex w-full flex-col gap-10">
          {/* 단계 정보 */}
          <div className="flex w-full flex-col gap-2">
            <AnimatedContainer variant="fadeInUp" delay={0.1} className="mb-2 w-full text-left" disabled={false}>
              <p className="text-detail-01 text-gray-60">1단계</p>
              <h2 className="text-heading-02-semibold text-gray-100">{stage1Name}</h2>
            </AnimatedContainer>

            {/* 흰색 박스 */}
            <AnimatedContainer
              variant="fadeInScale"
              delay={0.2}
              className="border-gray-20 w-full overflow-visible rounded-[16px] border bg-white"
              disabled={false}
            >
              <div className="relative h-[352px] w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <p className="text-[48px] font-medium text-nowrap whitespace-pre text-[#ff1f1f]">GREAT!</p>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* 버튼 */}
          <AnimatedContainer
            variant="fadeIn"
            delay={0.25}
            className="flex w-full flex-col items-center gap-4"
            disabled={false}
          >
            <button
              onClick={handleNext}
              className="text-heading-02-semibold border-blue-1 text-gray-80 hover:bg-gray-10 h-12 w-72 cursor-pointer rounded-full border bg-white transition-colors"
            >
              다음 진행하기
            </button>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default SteadySound;
