import BlueCircle from '@/assets/svgs/talkingkit/bluecircle2.svg';
import GrayBox from '@/assets/svgs/talkingkit/grayrectangle.svg';

interface ShortSoundVisualizerProps {
  phase: 'ready' | 'playing';
  ballPosition: number; // 90-0% (오른쪽 90% → 왼쪽 0%)
  ballScale?: number; // 1.0-1.3
}

const ShortSoundVisualizer = ({ ballPosition, ballScale = 1.0 }: ShortSoundVisualizerProps) => {
  return (
    <div className="relative flex h-[352px] w-full items-center justify-center px-4">
      {/* 가로선 - 회색 박스 중심에 배치 */}
      <div className="absolute right-[20px] left-[20px] h-[2px] bg-gray-400" style={{ top: 'calc(50% + 19px)' }} />

      {/* 회색 박스 1 - "어" (2초 지점, 60%) */}
      <div className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '60%' }}>
        <div className="flex flex-col items-center gap-2">
          <p className="text-heading-02-medium text-gray-100">어</p>
          <GrayBox className="size-[56px]" />
        </div>
      </div>

      {/* 회색 박스 2 - "아" (4초 지점, 30%) */}
      <div className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '30%' }}>
        <div className="flex flex-col items-center gap-2">
          <p className="text-heading-02-medium text-gray-100">아</p>
          <GrayBox className="size-[56px]" />
        </div>
      </div>

      {/* 파란 공 - 위치와 scale 애니메이션 (90% ~ 0% 범위, 오른쪽 → 왼쪽) */}
      <div
        className="absolute z-10 transition-transform duration-400 ease-in-out"
        style={{
          top: 'calc(50% + 19px)',
          left: `${ballPosition}%`,
          transform: `translate(-50%, -50%) scale(${ballScale})`,
        }}
      >
        <BlueCircle className="size-[53px]" />
      </div>
    </div>
  );
};

export default ShortSoundVisualizer;
