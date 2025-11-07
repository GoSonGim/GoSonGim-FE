import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { PitchData } from '@/types/talkingkit/pitch';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';

interface PitchVisualizerProps {
  pitchDataList: PitchData[];
  baselineFrequency: number | null;
  isDetecting: boolean;
}

const PitchVisualizer = ({ pitchDataList, baselineFrequency }: PitchVisualizerProps) => {
  // 주파수 차이를 픽셀 오프셋으로 변환 (1px = 1Hz)
  const calculatePixelOffset = (frequency: number, baseline: number): number => {
    const frequencyDiff = frequency - baseline;
    // 1Hz = 1px로 직접 매핑
    const pixelOffset = frequencyDiff;
    // -20 ~ +20 범위로 제한 (경계 이외는 경계선에 표시)
    return Math.max(-20, Math.min(20, pixelOffset));
  };

  // 최근 데이터를 기반으로 SVG path 생성 (최대 100개 포인트) - 부드러운 곡선
  const svgPath = useMemo(() => {
    if (!baselineFrequency || pitchDataList.length === 0) return '';

    // 표시할 최대 포인트 수
    const maxPoints = 100;
    const displayData = pitchDataList.slice(-maxPoints);

    if (displayData.length < 2) return '';

    // 컨테이너 너비의 80%를 사용 (left: 10%, right: 10%)
    const usableWidth = 80; // 80%
    const pointSpacing = usableWidth / Math.max(displayData.length - 1, 1);

    // 포인트 좌표 배열 생성
    const points: { x: number; y: number }[] = displayData.map((data, index) => ({
      x: 10 + index * pointSpacing,
      y: 100 - calculatePixelOffset(data.frequency, baselineFrequency), // SVG는 위가 0, 아래가 200이므로 부호 반전
    }));

    // Catmull-Rom 스플라인을 사용한 부드러운 곡선 생성
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      // Catmull-Rom to Cubic Bezier 변환
      // 제어점 계산
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  }, [pitchDataList, baselineFrequency]);

  return (
    <AnimatedContainer variant="fadeInUp" delay={0} className="w-full overflow-visible">
      {/* 메인 컨테이너 - 흰색 박스 */}
      <div className="relative flex h-[352px] w-full flex-col items-center gap-4 overflow-visible rounded-2xl bg-white p-4">
        {/* "아" 텍스트 박스 - 회색 보더 */}
        <div className="border-gray-20 flex h-[66px] w-[288px] items-center justify-center rounded-2xl border-4">
          <h3 className="text-[32px] leading-normal font-medium text-black">아</h3>
        </div>

        {/* 시각화 영역 */}
        <div className="relative flex h-[200px] w-full items-center justify-center overflow-visible px-4">
          {!baselineFrequency || pitchDataList.length === 0 ? (
            <>
              {/* 기준선만 표시 (녹음 전) */}
              <div
                className="absolute right-[10%] left-[10%] border-t-2 border-black"
                style={{
                  top: '50%',
                }}
              />
            </>
          ) : (
            <>
              {/* 기준선 (중앙 고정) */}
              <div
                className="absolute right-[10%] left-[10%] border-t-2 border-black"
                style={{
                  top: '50%',
                }}
              />

              {/* SVG로 연속적인 음정 선 그리기 - 빨간색 */}
              <svg
                className="absolute top-0 left-0 h-full w-full"
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                {svgPath && (
                  <motion.path
                    d={svgPath}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </svg>
            </>
        )}
      </div>
    </div>
    </AnimatedContainer>
  );
};

export default PitchVisualizer;
