import { useEffect, useRef, useState } from 'react';

interface TimerProgressBarProps {
  duration: number; // milliseconds
  onComplete?: () => void;
}

const TimerProgressBar = ({ duration, onComplete }: TimerProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // progress 값을 0-100 범위로 정규화
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  useEffect(() => {
    // ref를 사용한 직접 DOM 조작
    if (progressBarRef.current) {
      const widthValue = `${normalizedProgress}%`;

      // GPU 가속을 사용한 부드러운 애니메이션
      progressBarRef.current.style.width = widthValue;
      progressBarRef.current.style.transform = 'translateZ(0)'; // GPU 가속

      // 진행도가 0보다 크면 배경색이 확실히 보이도록 강제 설정
      if (normalizedProgress > 0) {
        progressBarRef.current.style.backgroundColor = '#5856D6';
        progressBarRef.current.style.opacity = '1';
      }
    }
  }, [normalizedProgress]);

  return (
    <div ref={containerRef} className="bg-gray-20 relative h-[8px] w-full overflow-hidden rounded-[100px] shadow-inner">
      <div
        ref={progressBarRef}
        className="absolute top-0 left-0 h-full rounded-[100px] shadow-md"
        style={{
          width: '0%',
          backgroundColor: '#5856D6',
          willChange: 'width',
          minWidth: normalizedProgress > 0 ? '4px' : '0px',
        }}
      />
    </div>
  );
};

export default TimerProgressBar;
