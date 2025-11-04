import clsx from 'clsx';

type TabType = '조음발음' | '상황극';

interface StudyTalkTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function StudyTalkTabs({ activeTab, onTabChange }: StudyTalkTabsProps) {
  return (
    <div className="flex w-full items-center bg-white">
      <button
        onClick={() => onTabChange('조음발음')}
        className={clsx(
          'flex h-[56px] w-[196.5px] shrink-0 cursor-pointer items-center justify-center border-b border-solid transition-colors',
          activeTab === '조음발음' ? 'border-blue-1 text-gray-100' : 'text-gray-40 border-transparent',
        )}
      >
        <p className="text-center text-[20px] leading-normal font-semibold">조음•발음 연습</p>
      </button>

      <button
        onClick={() => onTabChange('상황극')}
        className={clsx(
          'flex shrink-0 cursor-pointer items-center justify-center border-b border-solid px-[52px] py-[13px] transition-colors',
          activeTab === '상황극' ? 'border-blue-1 text-gray-100' : 'text-gray-40 border-transparent',
        )}
      >
        <p className="text-center text-[20px] leading-normal font-semibold">상황극 연습</p>
      </button>
    </div>
  );
}
