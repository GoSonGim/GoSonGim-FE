import { useEffect, useRef } from 'react';
import type { ProgressBarProps } from '@/types/talkingkit/longSoundKit/breathing';

interface BaseProgressBarProps {
  progress: number; // 0-100%
  className?: string;
  backgroundColor?: string;
}

/**
 * 공통 ProgressBar 컴포넌트
 * 직접 DOM 조작을 통해 GPU 가속 애니메이션 제공
 */
export const BaseProgressBar = ({ progress, className, backgroundColor = '#5856D6' }: BaseProgressBarProps) => {
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      const widthValue = `${normalizedProgress}%`;

      // GPU 가속을 사용한 부드러운 애니메이션
      progressBarRef.current.style.width = widthValue;
      progressBarRef.current.style.transform = 'translateZ(0)'; // GPU 가속

      // 진행도가 0보다 크면 배경색이 확실히 보이도록 강제 설정
      if (normalizedProgress > 0) {
        progressBarRef.current.style.backgroundColor = backgroundColor;
        progressBarRef.current.style.opacity = '1';
      }
    }
  }, [normalizedProgress, backgroundColor]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[8px] w-full overflow-hidden rounded-[100px] shadow-inner ${className || ''}`}
    >
      <div
        ref={progressBarRef}
        className="absolute top-0 left-0 h-full rounded-[100px] shadow-md"
        style={{
          width: '0%',
          backgroundColor,
          willChange: 'width',
          minWidth: normalizedProgress > 0 ? '4px' : '0px',
        }}
      />
    </div>
  );
};

/**
 * 외부에서 progress 값을 받아서 표시하는 ProgressBar
 */
export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return <BaseProgressBar progress={progress} className="bg-[#e2e4e7]" />;
};

export default ProgressBar;
