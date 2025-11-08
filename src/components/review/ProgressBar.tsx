import { useEffect, useRef } from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      // 0-100 범위 정규화
      const normalizedProgress = Math.max(0, Math.min(100, progress));

      // 직접 DOM 조작으로 성능 최적화
      progressRef.current.style.width = `${normalizedProgress}%`;
    }
  }, [progress]);

  return (
    <div className="relative h-[14px] w-full overflow-hidden bg-[#F1F1F5]">
      <div
        ref={progressRef}
        className="h-full bg-[#4C5EFF] transition-all duration-100 ease-linear"
        style={{
          minWidth: progress > 0 ? '4px' : '0px',
          transform: 'translateZ(0)',
          willChange: 'width',
        }}
      />
    </div>
  );
};

export default ProgressBar;
