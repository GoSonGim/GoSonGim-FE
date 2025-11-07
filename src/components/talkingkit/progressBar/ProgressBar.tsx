import type { ProgressBarProps } from '@/types/breathing';
import { useEffect, useRef } from 'react';

const ProgressBar = ({ progress }: ProgressBarProps) => {
  // progress 값을 0-100 범위로 정규화
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const prevProgressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ref를 사용한 직접 DOM 조작
    if (progressBarRef.current) {
      const widthValue = `${normalizedProgress}%`;

      // GPU 가속을 사용한 부드러운 애니메이션
      progressBarRef.current.style.width = widthValue;
      progressBarRef.current.style.transform = 'translateZ(0)'; // GPU 가속

      // 테스트: 콘솔에 실제 렌더링된 너비 출력 (로그 감소)
      if (Math.abs(normalizedProgress - prevProgressRef.current) > 10) {
        const actualWidth = progressBarRef.current.offsetWidth;
        const containerWidth = containerRef.current?.offsetWidth || 0;
        console.log(`📊 진행: ${normalizedProgress.toFixed(1)}% | ${actualWidth}px / ${containerWidth}px`);
        prevProgressRef.current = normalizedProgress;
      }

      // 진행도가 0보다 크면 배경색이 확실히 보이도록 강제 설정
      if (normalizedProgress > 0) {
        progressBarRef.current.style.backgroundColor = '#5856D6';
        progressBarRef.current.style.opacity = '1';
      }
    }

    // 시작과 끝 로그
    if (normalizedProgress === 0) {
      console.log('▶️ 진행바 시작 (0%)');
    } else if (normalizedProgress >= 99.9) {
      console.log('✅ 진행바 완료 (100%)');
    }
  }, [normalizedProgress]);

  return (
    <div
      ref={containerRef}
      className="relative h-[8px] w-full overflow-hidden rounded-[100px] bg-[#e2e4e7] shadow-inner"
    >
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

export default ProgressBar;
