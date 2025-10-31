import clsx from 'clsx';

type SortOption = '최신순' | '오래된순';

interface SortFilterProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortFilter({ selectedSort, onSortChange }: SortFilterProps) {
  const sortOptions: SortOption[] = ['최신순', '오래된순'];

  return (
    <div className="flex items-center gap-[8px]">
      {sortOptions.map((option) => (
        <button
          key={option}
          onClick={() => onSortChange(option)}
          className={clsx(
            'flex items-center justify-center rounded-full px-[10px] py-[4px] transition-colors cursor-pointer',
            selectedSort === option
              ? 'bg-[#f1f1f5] text-gray-100'
              : 'border border-[#f1f1f5] bg-white text-[#a6aeb6]'
          )}
        >
          <p className="text-[18px] leading-[1.5] font-normal">
            {option}
          </p>
        </button>
      ))}
    </div>
  );
}
