import clsx from 'clsx';

type CategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';

interface CategoryFilterProps {
  selectedCategory: CategoryOption;
  onCategoryChange: (category: CategoryOption) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: CategoryOption[] = ['전체', '호흡', '조음위치', '조음방법'];

  return (
    <div className="border-b border-[#f1f1f5] bg-white px-[20px] py-[16px] w-full">
      <div className="flex items-center gap-[24px] text-[20px] leading-[1.5]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={clsx(
              'text-center transition-colors cursor-pointer',
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
  );
}
