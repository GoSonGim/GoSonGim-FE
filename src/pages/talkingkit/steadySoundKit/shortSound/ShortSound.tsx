import { useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Step2Layout from '@/components/talkingkit/layout/Step2Layout';
import ShortSoundVisualizer from '@/components/talkingkit/shortSound/ShortSoundVisualizer';
import ShortSoundResult from '@/pages/talkingkit/shortSound/ShortSoundResult';
import TimerProgressBar from '@/components/talkingkit/progressBar/TimerProgressBar';
import { useBallAnimation } from '@/hooks/talkingkit/shortSound/useBallAnimation';
import { useVoiceDetection } from '@/hooks/talkingkit/common/useVoiceDetection';
import {
  evaluateShortSound,
  calculateScaleFromAccuracy,
  type ShortSoundEvaluationResult,
} from '@/utils/talkingkit/shortSoundEvaluation';
import {
  TARGET_POINTS,
  DURATION,
  DUPLICATE_DETECTION_THRESHOLD,
  TARGET_POINT_TOLERANCE,
} from '@/constants/talkingkit/shortSound';
import { logger } from '@/utils/common/loggerUtils';
import { handleError } from '@/utils/talkingkit/audioErrorHandlerUtils';
import { useKitDetail } from '@/hooks/talkingkit/queries/useKitDetail';
import type { KitStage } from '@/types/talkingkit/kit';

type Phase = 'ready' | 'playing' | 'result';

const ShortSound = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const kitId = id ? parseInt(id, 10) : 2; // fallback to 2 for steady sound kit

  const [phase, setPhase] = useState<Phase>('ready');
  const [recordings, setRecordings] = useState<number[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<ShortSoundEvaluationResult | null>(null);
  const lastRecordingRef = useRef<number>(-1);
  const processedPointsRef = useRef<Set<number>>(new Set()); // 처리된 지점 추적
  const stopVoiceRef = useRef<(() => void) | null>(null);
  const stopBallRef = useRef<(() => void) | null>(null);
  const { data: kitDetail, isLoading, isError } = useKitDetail(kitId);

  const getStage = (stageId: number): KitStage | null => {
    if (!kitDetail?.result?.stages) return null;
    return kitDetail.result.stages.find((stage) => stage.stageId === stageId) || null;
  };

  // API에서 받아온 2단계 이름 (stageId: 2)
  const stage2Name: string = getStage(2)?.stageName || '짧게 끊어 발성하기';

  const handleTimerComplete = useCallback(() => {
    logger.log('타이머 완료, 평가 시작');
    if (stopVoiceRef.current) stopVoiceRef.current();
    if (stopBallRef.current) stopBallRef.current();

    // 평가 수행
    const result = evaluateShortSound(recordings, TARGET_POINTS);
    logger.log('평가 결과:', result);
    setEvaluationResult(result);
    setPhase('result');
  }, [recordings]);

  const {
    position,
    scale,
    start: startBall,
    stop: stopBall,
    triggerScaleAnimation,
  } = useBallAnimation({
    duration: DURATION,
    onComplete: handleTimerComplete,
  });

  stopBallRef.current = stopBall;

  const handleVoiceDetected = useCallback(
    (timestamp: number) => {
      // 중복 방지: 100ms 이내 같은 소리는 무시
      if (Math.abs(timestamp - lastRecordingRef.current) < DUPLICATE_DETECTION_THRESHOLD) {
        return;
      }

      lastRecordingRef.current = timestamp;
      setRecordings((prev) => [...prev, timestamp]);

      // 각 목표 지점에서 한 번만 애니메이션 실행
      for (const targetPoint of TARGET_POINTS) {
        const accuracy = Math.abs(timestamp - targetPoint);

        // 해당 지점을 아직 처리하지 않았고, 허용 오차 이내에 발음했다면
        if (accuracy <= TARGET_POINT_TOLERANCE && !processedPointsRef.current.has(targetPoint)) {
          processedPointsRef.current.add(targetPoint);
          const scaleValue = calculateScaleFromAccuracy(accuracy);
          triggerScaleAnimation(scaleValue);
          logger.log(`지점 ${targetPoint}ms에서 발음 감지! 오차: ${accuracy}ms, scale: ${scaleValue}`);
          break; // 하나의 지점만 처리
        }
      }
    },
    [triggerScaleAnimation],
  );

  const { start: startVoice, stop: stopVoice } = useVoiceDetection({
    onVoiceDetected: handleVoiceDetected,
    threshold: 0.02,
  });

  stopVoiceRef.current = stopVoice;

  const handleStart = async () => {
    logger.log('시작');
    setPhase('playing');
    setRecordings([]);
    processedPointsRef.current.clear();
    lastRecordingRef.current = -1;

    try {
      await startVoice();
      startBall();
    } catch (error) {
      logger.error('Failed to start:', error);
      alert(handleError(error));
      setPhase('ready');
    }
  };

  const handleBack = () => {
    if (phase === 'playing') {
      stopVoice();
      stopBall();
    }
    navigate(-1);
  };

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

  // 시작 전 화면
  if (phase === 'ready') {
    return (
      <Step2Layout
        headerTitle="일정한 소리 내기"
        title={stage2Name}
        showAction={true}
        guideText="선을 따라 일정하게 발음해주세요"
        buttonText="시작하기"
        onButtonClick={handleStart}
        onBackClick={handleBack}
      >
        <ShortSoundVisualizer phase="ready" ballPosition={90} ballScale={1.0} />
      </Step2Layout>
    );
  }

  // 진행 중 화면
  if (phase === 'playing') {
    return (
      <div className="bg-background-primary relative flex h-full flex-col">
        <Step2Layout headerTitle="일정한 소리 내기" title={stage2Name} disableAnimation={true} onBackClick={handleBack}>
          <ShortSoundVisualizer phase="playing" ballPosition={position} ballScale={scale} />
        </Step2Layout>

        {/* 하단 타이머 진행바 */}
        <div className="absolute right-0 bottom-0 left-0 z-50 px-[29px] pb-[40px]">
          <TimerProgressBar duration={DURATION} onComplete={handleTimerComplete} />
        </div>
      </div>
    );
  }

  // 결과 화면
  if (evaluationResult) {
    return <ShortSoundResult evaluationResult={evaluationResult} />;
  }

  // 평가 중
  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      <Step2Layout headerTitle="일정한 소리 내기" title={stage2Name} onBackClick={handleBack}>
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-body-01-regular text-gray-60">평가 중...</p>
        </div>
      </Step2Layout>
    </div>
  );
};

export default ShortSound;
