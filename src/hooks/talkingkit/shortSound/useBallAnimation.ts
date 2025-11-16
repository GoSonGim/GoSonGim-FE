import { useState, useRef, useCallback } from 'react';
import { animate, useMotionValue } from 'framer-motion';

interface BallAnimationState {
  position: number; // 0-100%
  scale: number; // 1.0-1.3
}

interface UseBallAnimationOptions {
  duration: number; // ms
  onComplete?: () => void;
}

export const useBallAnimation = ({ duration, onComplete }: UseBallAnimationOptions) => {
  const [state, setState] = useState<BallAnimationState>({
    position: 90, // 시작 위치 90%
    scale: 1.0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const scaleTimeoutRef = useRef<number | null>(null);

  // Framer Motion values
  const positionMotion = useMotionValue(90);
  const scaleMotion = useMotionValue(1.0);

  const animatePosition = useCallback(() => {
    if (!isRunningRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1); // 0 to 1

    // 90% → 0%로 선형 이동 (오른쪽 → 왼쪽)
    const newPosition = 90 - progress * 90;

    // Framer Motion value 업데이트
    positionMotion.set(newPosition);
    
    // State도 업데이트 (컴포넌트에서 사용)
    setState((prev) => ({
      ...prev,
      position: newPosition,
    }));

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animatePosition);
    } else {
      isRunningRef.current = false;
      if (onComplete) {
        onComplete();
      }
    }
  }, [duration, onComplete, positionMotion]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    startTimeRef.current = Date.now();
    isRunningRef.current = true;
    
    // 초기값 설정
    positionMotion.set(90);
    scaleMotion.set(1.0);
    setState({ position: 90, scale: 1.0 });
    
    animatePosition();
  }, [animatePosition, positionMotion, scaleMotion]);

  const stop = useCallback(() => {
    isRunningRef.current = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (scaleTimeoutRef.current) {
      clearTimeout(scaleTimeoutRef.current);
      scaleTimeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    positionMotion.set(90);
    scaleMotion.set(1.0);
    setState({ position: 90, scale: 1.0 });
  }, [stop, positionMotion, scaleMotion]);

  /**
   * Scale 애니메이션 트리거
   * @param targetScale 목표 scale (1.1 ~ 1.3)
   */
  const triggerScaleAnimation = useCallback(
    (targetScale: number) => {
      if (targetScale <= 1.0) return; // 애니메이션 없음

      // 기존 타이머 제거
      if (scaleTimeoutRef.current) {
        clearTimeout(scaleTimeoutRef.current);
      }

      // Framer Motion으로 scale 애니메이션
      animate(scaleMotion, targetScale, {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }).then(() => {
        // 400ms 후 Scale down
        scaleTimeoutRef.current = setTimeout(() => {
          animate(scaleMotion, 1.0, {
            type: 'spring',
            stiffness: 400,
            damping: 25,
          });
          setState((prev) => ({ ...prev, scale: 1.0 }));
        }, 400);
      });

      // State 업데이트
      setState((prev) => ({ ...prev, scale: targetScale }));
    },
    [scaleMotion],
  );

  return {
    position: state.position,
    scale: state.scale,
    positionMotion, // Framer Motion value (선택적 사용)
    scaleMotion, // Framer Motion value (선택적 사용)
    start,
    stop,
    reset,
    triggerScaleAnimation,
  };
};
