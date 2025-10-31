import { homeStudyPracticeMockData } from '@/mock/home/homeStudyPractice.mock';
import ArrowRight from '@/assets/svgs/home/arrow-right.svg';

interface HomeStudyPracticeProps {
  className?: string;
}

export default function HomeStudyPractice({ className }: HomeStudyPracticeProps) {
  return (
    <div className={`flex flex-col gap-6 ${className || ''}`}>
      <p className="text-[22px] leading-normal font-semibold text-gray-100">
        이런 <span className="text-blue-1">상황 연습</span>은 어떠신가요?
      </p>

      <div className="flex flex-col gap-2">
        {homeStudyPracticeMockData.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-4 cursor-pointer hover:bg-[#f1f1f5]">
            <div className="flex items-center gap-1 leading-normal">
              <p className="text-heading-02-semibold whitespace-nowrap text-gray-100">{item.title}</p>
              <p className="text-detail-02 whitespace-nowrap text-gray-50">•{item.category}</p>
            </div>
            <button aria-label={`${item.title} 시작하기`} className="flex shrink-0 items-center justify-center">
              <ArrowRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
