import { useState, useRef, useCallback } from 'react';

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

  const animate = useCallback(() => {
    if (!isRunningRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1); // 0 to 1

    // 90% → 0%로 선형 이동 (오른쪽 → 왼쪽)
    const newPosition = 90 - progress * 90;

    setState((prev) => ({
      ...prev,
      position: newPosition,
    }));

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      isRunningRef.current = false;
      if (onComplete) {
        onComplete();
      }
    }
  }, [duration, onComplete]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    startTimeRef.current = Date.now();
    isRunningRef.current = true;
    setState({ position: 90, scale: 1.0 }); // 시작 위치 90%
    animate();
  }, [animate]);

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
    setState({ position: 90, scale: 1.0 }); // 시작 위치 90%
  }, [stop]);

  /**
   * Scale 애니메이션 트리거
   * @param targetScale 목표 scale (1.1 ~ 1.3)
   */
  const triggerScaleAnimation = useCallback((targetScale: number) => {
    if (targetScale <= 1.0) return; // 애니메이션 없음

    // 기존 타이머 제거
    if (scaleTimeoutRef.current) {
      clearTimeout(scaleTimeoutRef.current);
    }

    // Scale up
    setState((prev) => ({ ...prev, scale: targetScale }));

    // 400ms 후 Scale down
    scaleTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, scale: 1.0 }));
    }, 400);
  }, []);

  return {
    position: state.position,
    scale: state.scale,
    start,
    stop,
    reset,
    triggerScaleAnimation,
  };
};
