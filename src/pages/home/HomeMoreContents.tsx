import { homeMoreContentsMockData } from '@/mock/home/homeMoreContents.mock';
import ChatIcon from '@/assets/svgs/home/chating.svg';
import PlusIcon from '@/assets/svgs/home/plus.svg';

interface HomeMoreContentsProps {
  className?: string;
}

export default function HomeMoreContents({ className }: HomeMoreContentsProps) {
  return (
    <div className={`flex flex-col gap-6 ${className || ''}`}>
      <p className="text-[22px] leading-normal font-semibold text-gray-100">추가 연습 컨텐츠</p>

      <div className="flex flex-col gap-2">
        {homeMoreContentsMockData.map((item) => (
          <div key={item.id} className="flex items-start gap-4 rounded-2xl bg-white px-3 py-[11px] cursor-pointer hover:bg-[#f1f1f5]">
            <div className="bg-blue-3 flex size-14 shrink-0 items-center justify-center rounded-2xl">
              {item.icon === 'chat' ? (
                <ChatIcon className="h-9 w-9" />
              ) : (
                <PlusIcon className="h-[27px] w-[27px]" />
              )}
            </div>
            <div className="flex flex-col items-start leading-normal">
              <p className="text-detail-02 whitespace-nowrap text-gray-50">{item.subtitle}</p>
              <p className="text-heading-02-semibold whitespace-nowrap text-gray-100">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
