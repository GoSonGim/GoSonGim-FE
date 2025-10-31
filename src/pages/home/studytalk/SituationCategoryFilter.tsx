import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';

export type SituationCategoryOption = '전체' | '일상' | '구매' | '의료' | '교통' | '직업' | '사회';

interface SituationCategoryFilterProps {
  selectedCategory: SituationCategoryOption;
  onCategoryChange: (category: SituationCategoryOption) => void;
}

export default function SituationCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: SituationCategoryFilterProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });
  const categories: SituationCategoryOption[] = ['전체', '일상', '구매', '의료', '교통', '직업', '사회'];

  return (
    <div className="border-b border-[#f1f1f5] bg-white px-[20px] py-[16px] w-full">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-[24px] text-[20px]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={clsx(
                'text-center transition-colors shrink-0 cursor-pointer',
                selectedCategory === category
                  ? 'font-semibold text-gray-100'
                  : 'font-normal text-[#a6aeb6]'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
