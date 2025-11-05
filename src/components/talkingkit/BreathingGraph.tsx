import { useState } from 'react';
import type { BreathingGraphProps } from '@/types/breathing';

const BreathingGraph = ({ phase, ballPosition, setBluePathRef, setRedPathRef }: BreathingGraphProps) => {
  const [bluePathLength, setBluePathLength] = useState(0);

  // 파란색 경로 ref 설정 및 길이 계산
  const handleBluePathRef = (element: SVGPathElement | null) => {
    setBluePathRef(element);
    if (element) {
      const length = element.getTotalLength();
      setBluePathLength(length);
    }
  };

  // 파란색 경로의 20% 지점부터 끝까지만 표시
  // dasharray: [앞 20% 간격, 나머지 80% 표시]
  const blueStartGap = bluePathLength > 0 ? bluePathLength * 0.2 : 0;
  const blueVisibleLength = bluePathLength > 0 ? bluePathLength * 0.8 : 0;

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative h-[219px] w-[353px]">
        {/* 배경 그래프 (검은색 - 항상 표시) */}
        <svg
          className="absolute top-0 left-0"
          width="353"
          height="219"
          viewBox="0 0 353 219"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M352.5 217.439C346.308 217.439 337.806 217.439 326 217.439C254.5 217.439 179.99 33.9387 167 11.4387C156.608 -6.56127 146.337 3.93873 142.5 11.4387C134 33.6054 113.1 91.7387 97.5 146.939C81.9 202.139 57 216.939 46.5 217.439H0"
            stroke="black"
            strokeWidth="3"
          />
        </svg>

        {/* 파란색 올라가기 경로 - 20% 지점부터 정점까지만 표시 */}
        <svg
          className="absolute top-0 left-0"
          width="353"
          height="219"
          viewBox="0 0 353 219"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: phase === 'inhale' ? 1 : 0 }}
        >
          <path
            ref={handleBluePathRef}
            d="M0 217.439H46.5C57 216.939 81.9 202.139 97.5 146.939C113.1 91.7387 134 33.6054 142.5 11.4387C146.337 3.93873 156.608 -6.56127 167 11.4387"
            stroke="#5856D6"
            strokeWidth="5"
            strokeLinecap="round"
            {...(bluePathLength > 0 && {
              strokeDasharray: `0 ${blueStartGap} ${blueVisibleLength}`,
            })}
          />
        </svg>

        {/* 빨간색 내려가기 경로 - 항상 렌더링하되 exhale에서만 표시 */}
        <svg
          className="absolute top-0 left-0"
          width="353"
          height="219"
          viewBox="0 0 353 219"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: phase === 'exhale' ? 1 : 0 }}
        >
          <path
            ref={setRedPathRef}
            d="M167 11.4387C179.99 33.9387 254.5 217.439 326 217.439C337.806 217.439 346.308 217.439 352.5 217.439"
            stroke="#FF2D55"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* 움직이는 공 */}
        {phase !== 'complete' && phase !== 'ready' && (
          <div
            className="absolute z-10 h-[26px] w-[26px] rounded-full bg-[#D1D5DB] shadow-lg"
            style={{
              left: `${ballPosition.x}px`,
              top: `${ballPosition.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* ready 상태 공 (왼쪽 20% 지점) */}
        {phase === 'ready' && (
          <div
            className="absolute z-10 h-[26px] w-[26px] rounded-full bg-[#D1D5DB] shadow-lg"
            style={{
              left: `${ballPosition.x}px`,
              top: `${ballPosition.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BreathingGraph;
