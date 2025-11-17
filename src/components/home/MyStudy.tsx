import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useBookmarkPreview } from '@/hooks/bookmark/queries/useBookmarkPreview';
import ArrowButtonIcon from '@/assets/svgs/home/arrow-button.svg';

interface HomeMyStudyProps {
  className?: string;
}

export default function HomeMyStudy({ className }: HomeMyStudyProps) {
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });
  const { data: bookmarkData, isLoading, error } = useBookmarkPreview(10);

  const bookmarkList = bookmarkData?.result.bookmarkList || [];

  return (
    <div className={`flex flex-col gap-2 rounded-2xl px-0 py-2 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-[22px] leading-normal font-semibold text-gray-100">내 학습</p>
        <ArrowButtonIcon className="w-[48px] h-[48px] cursor-pointer" onClick={() => navigate('/studytalk')} />
      </div>

      {isLoading ? (
        <div className="text-body-14-regular text-gray-60">로딩 중...</div>
      ) : error ? (
        <div className="text-body-14-regular text-red-500">오류가 발생했습니다.</div>
      ) : bookmarkList.length === 0 ? (
        <div className="text-body-14-regular text-gray-60">북마크한 학습이 없습니다.</div>
      ) : (
        <div className="embla overflow-hidden py-2" ref={emblaRef}>
          <div className="embla__container flex gap-2">
            {bookmarkList.map((item, index) => (
              <div
                key={item.bookmarkId}
                className={`embla__slide group flex h-32 cursor-pointer w-[152px] min-w-[152px] flex-col items-end justify-between gap-6 rounded-2xl p-3 transition-colors ${
                  index === 0 ? 'bg-white shadow-sm hover:bg-[#f1f1f5]' : 'bg-white hover:bg-[#f1f1f5]'
                }`}
              >
                <div className="flex w-full flex-col items-start leading-normal">
                  <p className="text-detail-02 text-gray-50">{item.category}</p>
                  <p className="text-heading-02-semibold text-gray-100">{item.title}</p>
                </div>
                <div
                  className={`flex items-center justify-center rounded-full border border-solid px-2 py-1 transition-colors ${
                    index === 0 ? 'border-blue-3 bg-white group-hover:bg-[#f1f1f5]' : 'border-blue-3 bg-blue-3'
                  }`}
                >
                  <p className="text-detail-01 text-gray-80">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
