import { useEffect, useRef, useState } from 'react';
import { BaseProgressBar } from './ProgressBar';

interface TimerProgressBarProps {
  duration: number; // milliseconds
  onComplete?: () => void;
}

const TimerProgressBar = ({ duration, onComplete }: TimerProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // onComplete가 변경되면 ref 업데이트
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const elapsed = duration - remaining;
      const progressPercent = (elapsed / duration) * 100;

      setProgress(progressPercent);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  return <BaseProgressBar progress={progress} className="bg-gray-20" />;
};

export default TimerProgressBar;
