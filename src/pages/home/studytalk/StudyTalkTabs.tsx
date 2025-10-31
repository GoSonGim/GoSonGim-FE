import clsx from 'clsx';

type TabType = '조음발음' | '상황극';

interface StudyTalkTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function StudyTalkTabs({ activeTab, onTabChange }: StudyTalkTabsProps) {
  return (
    <div className="flex items-center bg-white w-full">
      <button
        onClick={() => onTabChange('조음발음')}
        className={clsx(
          'h-[56px] w-[196.5px] flex items-center justify-center border-b border-solid transition-colors shrink-0 cursor-pointer',
          activeTab === '조음발음'
            ? 'border-[#4c5eff] text-gray-100'
            : 'border-transparent text-[#a6aeb6]'
        )}
      >
        <p className="text-[20px] font-semibold leading-[1.5] text-center">
          조음•발음 연습
        </p>
      </button>

      <button
        onClick={() => onTabChange('상황극')}
        className={clsx(
          'flex items-center justify-center px-[52px] py-[13px] border-b border-solid transition-colors shrink-0 cursor-pointer',
          activeTab === '상황극'
            ? 'border-[#4c5eff] text-gray-100'
            : 'border-transparent text-[#a6aeb6]'
        )}
      >
        <p className="text-[20px] font-semibold leading-[1.5] text-center">
          상황극 연습
        </p>
      </button>
    </div>
  );
}
