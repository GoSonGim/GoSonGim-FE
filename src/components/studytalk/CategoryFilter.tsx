import clsx from 'clsx';

type CategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';

interface CategoryFilterProps {
  selectedCategory: CategoryOption;
  onCategoryChange: (category: CategoryOption) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: CategoryOption[] = ['전체', '호흡', '조음위치', '조음방법'];

  return (
    <div className="w-full border-b border-[#f1f1f5] bg-white px-[20px] py-[16px]">
      <div className="flex items-center gap-[24px] text-[20px] leading-normal">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={clsx(
              'relative cursor-pointer pb-1 text-center transition-colors',
              selectedCategory === category ? 'font-semibold text-gray-100' : 'text-gray-40 font-normal',
            )}
          >
            {category}
            {selectedCategory === category && (
              <div className="absolute -bottom-px left-0 z-10 h-[2px] w-full bg-gray-100" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
