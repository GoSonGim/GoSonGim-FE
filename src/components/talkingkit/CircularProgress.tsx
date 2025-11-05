import { useEffect, useState, useRef } from 'react';
import WhiteSquare from '@/assets/svgs/talkingkit/whitesquare.svg';
import GrayCircle from '@/assets/svgs/talkingkit/graycircle.svg';

interface CircularProgressProps {
  duration: number; // milliseconds
  onComplete?: () => void;
  size?: number; // default: 88
}

const CircularProgress = ({ duration, onComplete, size = 88 }: CircularProgressProps) => {
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

  const grayCircleSize = size;
  const strokeWidth = 4; // 프로그레스 원 두께를 얇게
  const svgSize = grayCircleSize + strokeWidth * 2; // SVG 크기를 stroke 두께만큼 늘림 (96px)
  const center = svgSize / 2;
  const radius = grayCircleSize / 2 + strokeWidth / 2; // 반지름을 늘려서 바깥쪽에 그리기
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: grayCircleSize, height: grayCircleSize, overflow: 'visible' }}
    >
      {/* 프로그레스 원 - 먼저 렌더링 (뒤쪽) */}
      <svg
        width={svgSize}
        height={svgSize}
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          overflow: 'visible',
        }}
      >
        {/* 프로그레스 원 - 연한 파란색 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#9AADFF"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.1s linear',
          }}
        />
      </svg>

      {/* 배경 GrayCircle 아이콘 - 나중에 렌더링 (앞쪽, z-index 높음) */}
      <div className="absolute z-10">
        <GrayCircle style={{ width: grayCircleSize, height: grayCircleSize }} />
      </div>

      {/* 중앙의 정지 아이콘 */}
      <div className="relative z-20 flex items-center justify-center">
        <WhiteSquare className="size-[26px]" />
      </div>
    </div>
  );
};

export default CircularProgress;
