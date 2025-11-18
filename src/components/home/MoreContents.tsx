import { useNavigate } from 'react-router-dom';
import { homeMoreContentsMockData } from '@/mock/home/homeMoreContents.mock';
import ChatIcon from '@/assets/svgs/home/chating.svg';
import PlusIcon from '@/assets/svgs/home/plus.svg';

interface HomeMoreContentsProps {
  className?: string;
}

export default function HomeMoreContents({ className }: HomeMoreContentsProps) {
  const navigate = useNavigate();

  const handleItemClick = (id: number) => {
    console.log('클릭된 아이템 ID:', id);
    if (id === 1) {
      // 자유대화 시작하기
      console.log('자유대화 페이지로 이동 시도');
      navigate('/freetalk');
    } else {
      // 조음키트 진단 받기 - 추후 구현
      console.log('조음키트 진단 받기 클릭');
    }
  };

  return (
    <div className={`flex flex-col gap-6 shadow-lg ${className || ''}`}>
      <p className="text-[22px] leading-normal font-semibold text-gray-100">추가 연습 컨텐츠</p>

      <div className="flex flex-col gap-2">
        {homeMoreContentsMockData.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex cursor-pointer items-start gap-4 rounded-2xl bg-white px-3 py-[11px] hover:bg-[#f1f1f5]"
          >
            <div className="bg-blue-3 flex size-14 shrink-0 items-center justify-center rounded-2xl">
              {item.icon === 'chat' ? <ChatIcon className="h-9 w-9" /> : <PlusIcon className="h-[27px] w-[27px]" />}
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
