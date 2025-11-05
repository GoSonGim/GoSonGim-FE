import LeftArrowIcon from '@/assets/svgs/talkingkit/leftarrow.svg';
import KitCard from '@/components/talkingkit/KitCard';
import { kitsData } from '@/mock/talkingkit/kitsData';

const TalkingKit = () => {
  return (
    <div className="bg-background-primary relative h-full">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 (UI만) */}
          <div className="absolute left-4 flex size-12 items-center justify-center overflow-hidden p-2">
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">호흡 및 발성 기초 키트</p>
        </div>
      </div>

      {/* 키트 그리드 */}
      <div className="mt-10 px-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {kitsData.slice(0, 2).map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
          <div className="flex gap-4">
            {kitsData.slice(2, 3).map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkingKit;
