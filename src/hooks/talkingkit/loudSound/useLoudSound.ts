import { useState, useEffect } from 'react';

export type Phase = 'ready' | 'playing' | 'complete';
export type ActiveText = 'left' | 'center' | 'right' | null;

export const useLoudSound = () => {
  const [phase, setPhase] = useState<Phase>('ready');
  const [activeText, setActiveText] = useState<ActiveText>(null);
  const [ringScale, setRingScale] = useState(1.0);

  const start = () => {
    setPhase('playing');
  };

  const reset = () => {
    setPhase('ready');
    setActiveText(null);
    setRingScale(1.0);
  };

  // 타이머 로직
  useEffect(() => {
    if (phase === 'playing') {
      // 0초: 왼쪽 "들숨"
      const timer1 = setTimeout(() => setActiveText('left'), 0);

      // 2초: "후!" + 링 애니메이션
      const timer2 = setTimeout(() => {
        setActiveText('center');
        setRingScale(1.7);
        setTimeout(() => setRingScale(1.0), 500);
      }, 2000);

      // 4초: 완료
      const timer3 = setTimeout(() => setPhase('complete'), 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [phase]);

  return {
    phase,
    activeText,
    ringScale,
    start,
    reset,
  };
};
