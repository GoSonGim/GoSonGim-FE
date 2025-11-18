import { type ReactNode } from 'react';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';

interface KitListLayoutProps {
  title: string;
  gridCount: number;
  children: ReactNode;
  onBack?: () => void;
}

const KitListLayout = ({ title, children, onBack }: KitListLayoutProps) => {
  return (
    <div className="bg-background-primary relative h-full">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={onBack}
            className="absolute left-4 flex size-12 items-center justify-center overflow-hidden p-2 cursor-pointer"
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </button>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">{title}</p>
        </div>
      </div>

      {/* 키트 그리드 */}
      <div className="mt-12 px-4">
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};

export default KitListLayout;
