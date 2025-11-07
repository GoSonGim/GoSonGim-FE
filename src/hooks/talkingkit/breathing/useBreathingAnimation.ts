import { useState, useCallback, useRef, useEffect } from 'react';
import type { BreathingState, BreathingPhase } from '@/types/breathing';

/**
 * 경과 시간에 따른 단계 결정
 */
const getPhaseFromTime = (elapsedTime: number): BreathingPhase => {
  if (elapsedTime < 5000) {
    return 'inhale';
  } else if (elapsedTime < 10000) {
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
    ballPosition: { x: 50, y: 200 }, // 초기 위치 (왼쪽 20% 지점 근사값)
  });

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const bluePathRef = useRef<SVGPathElement | null>(null);
  const redPathRef = useRef<SVGPathElement | null>(null);

  /**
   * 초기 공 위치 계산 (파란색 경로의 20% 지점)
   */
  const getInitialBallPosition = useCallback((): { x: number; y: number } => {
    if (bluePathRef.current) {
      try {
        const pathLength = bluePathRef.current.getTotalLength();
        const point = bluePathRef.current.getPointAtLength(pathLength * 0.2);
        return { x: point.x, y: point.y };
      } catch (error) {
        console.error('Error getting initial position:', error);
      }
    }
    return { x: 50, y: 200 }; // 왼쪽 근처 fallback
  }, []);

  /**
   * SVG 경로를 따라 공의 위치 계산
   * progress는 0(0%)부터 1(100%)까지
   * 실제로는 20%부터 100%까지의 경로를 사용
   */
  const calculateBallPosition = useCallback(
    (progress: number): { x: number; y: number } => {
      // 0~50%: 올라가기 (파란색 경로) - 왼쪽에서 정점까지
      if (progress <= 0.5 && bluePathRef.current) {
        try {
          const pathLength = bluePathRef.current.getTotalLength();
          // progress 0~0.5를 0.2~1.0으로 매핑
          const blueProgress = 0.2 + progress * 2 * 0.8; // 0.2 ~ 1.0
          const point = bluePathRef.current.getPointAtLength(pathLength * blueProgress);
          return { x: point.x, y: point.y };
        } catch (error) {
          console.error('Error calculating blue path position:', error);
        }
      }
      // 50~100%: 내려가기 (빨간색 경로) - 정점에서 오른쪽까지
      else if (progress > 0.5 && redPathRef.current) {
        try {
          const pathLength = redPathRef.current.getTotalLength();
          // progress 0.5~1.0을 0~1.0으로 매핑
          const redProgress = (progress - 0.5) * 2;
          const point = redPathRef.current.getPointAtLength(pathLength * redProgress);
          return { x: point.x, y: point.y };
        } catch (error) {
          console.error('Error calculating red path position:', error);
        }
      }
      // Fallback position
      return getInitialBallPosition();
    },
    [getInitialBallPosition],
  );

  const start = useCallback(() => {
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / 10000, 1);
      const progressPercent = progress * 100;

      const phase = elapsed >= 10000 ? 'complete' : getPhaseFromTime(elapsed);
      const ballPosition = calculateBallPosition(progress);

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
  }, [calculateBallPosition]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setState({
      phase: 'ready',
      progress: 0,
      elapsedTime: 0,
      ballPosition: getInitialBallPosition(),
    });
  }, [getInitialBallPosition]);

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
      if (bluePathRef.current) {
        try {
          const pathLength = bluePathRef.current.getTotalLength();
          const point = bluePathRef.current.getPointAtLength(pathLength * 0.2);
          setState((prev) => {
            // ready 상태일 때만 초기 위치 설정
            if (prev.phase === 'ready') {
              return {
                ...prev,
                ballPosition: { x: point.x, y: point.y },
              };
            }
            return prev;
          });
        } catch (error) {
          console.error('Error setting initial position:', error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []); // 마운트 시 한 번만 실행

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
