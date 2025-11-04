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
            'flex cursor-pointer items-center justify-center rounded-full px-[10px] py-[4px] transition-colors',
            selectedSort === option ? 'bg-[#f1f1f5] text-gray-100' : 'text-gray-40 border border-[#f1f1f5] bg-white',
          )}
        >
          <p className="text-[18px] leading-normal font-normal">{option}</p>
        </button>
      ))}
    </div>
  );
}
