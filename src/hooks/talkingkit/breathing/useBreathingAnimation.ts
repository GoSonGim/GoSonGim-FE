import { useState, useCallback, useRef, useEffect } from 'react';
import { useMotionValue } from 'framer-motion';
import type { BreathingState, BreathingPhase } from '@/types/talkingkit/breathing';
import { ANIMATION_DURATION, INHALE_DURATION, INITIAL_POSITION_DELAY } from '@/constants/talkingkit/breathing';
import {
  getInitialBallPosition,
  calculateBluePathPosition,
  calculateRedPathPosition,
} from '@/utils/talkingkit/breathingPathUtils';

/**
 * 경과 시간에 따른 단계 결정
 */
const getPhaseFromTime = (elapsedTime: number): BreathingPhase => {
  if (elapsedTime < INHALE_DURATION) {
    return 'inhale';
  } else if (elapsedTime < ANIMATION_DURATION) {
    return 'exhale';
  } else {
    return 'complete';
  }
};

export const useBreathingAnimation = () => {
  const [state, setState] = useState<BreathingState>({
    phase: 'ready',
    progress: 0,
    elapsedTime: 0,
    ballPosition: getInitialBallPosition(null), // 초기 위치 (왼쪽 20% 지점 근사값)
  });

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const bluePathRef = useRef<SVGPathElement | null>(null);
  const redPathRef = useRef<SVGPathElement | null>(null);

  // Framer Motion value for progress (선택적 - 부드러운 전환용)
  const progressMotion = useMotionValue(0);

  /**
   * 초기 공 위치 계산 (파란색 경로의 시작 지점)
   */
  const getInitialPosition = useCallback((): { x: number; y: number } => {
    return getInitialBallPosition(bluePathRef.current);
  }, []);

  /**
   * SVG 경로를 따라 공의 위치 계산
   * progress는 0(0%)부터 1(100%)까지
   * 실제로는 20%부터 100%까지의 경로를 사용
   */
  const calculateBallPosition = useCallback((progress: number): { x: number; y: number } => {
    // 0~50%: 올라가기 (파란색 경로) - 왼쪽에서 정점까지
    if (progress <= 0.5) {
      return calculateBluePathPosition(bluePathRef.current, progress);
    }
    // 50~100%: 내려가기 (빨간색 경로) - 정점에서 오른쪽까지
    else {
      return calculateRedPathPosition(redPathRef.current, progress);
    }
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    progressMotion.set(0);

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const progressPercent = progress * 100;

      const phase = elapsed >= ANIMATION_DURATION ? 'complete' : getPhaseFromTime(elapsed);
      const ballPosition = calculateBallPosition(progress);

      // Framer Motion 값 업데이트 (부드러운 전환을 위해)
      progressMotion.set(progress);

      setState({
        phase,
        progress: progressPercent,
        elapsedTime: elapsed,
        ballPosition,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [calculateBallPosition, progressMotion]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    progressMotion.set(0);

    setState({
      phase: 'ready',
      progress: 0,
      elapsedTime: 0,
      ballPosition: getInitialPosition(),
    });
  }, [getInitialPosition, progressMotion]);

  /**
   * SVG 경로 요소 설정
   */
  const setBluePathRef = useCallback((element: SVGPathElement | null) => {
    bluePathRef.current = element;
  }, []);

  const setRedPathRef = useCallback((element: SVGPathElement | null) => {
    redPathRef.current = element;
  }, []);

  // 초기 위치 설정 (마운트 후 한 번만 실행)
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialPos = getInitialPosition();
      setState((prev) => {
        // ready 상태일 때만 초기 위치 설정
        if (prev.phase === 'ready') {
          return {
            ...prev,
            ballPosition: initialPos,
          };
        }
        return prev;
      });
    }, INITIAL_POSITION_DELAY);

    return () => clearTimeout(timer);
  }, [getInitialPosition]); // 마운트 시 한 번만 실행

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    ...state,
    start,
    reset,
    setBluePathRef,
    setRedPathRef,
  };
};
