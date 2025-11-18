import clsx from 'clsx';

interface TurnIndicatorProps {
  currentTurn: number;
  totalTurns: number;
  completedTurns?: number[];
}

/**
 * 상황극 턴 표시 컴포넌트 (FreeTalk 스타일)
 * "대화 1", "대화 2", ..., "대화 5"
 */
export const TurnIndicator = ({ currentTurn, totalTurns, completedTurns = [] }: TurnIndicatorProps) => {
  return (
    <div className="flex shrink-0 gap-2 px-4 pb-4 pt-6">
      {[...Array(totalTurns)].map((_, index) => {
        const turnNum = index + 1;
        const isCompleted = completedTurns.includes(turnNum);
        const isActive = currentTurn === turnNum;
        const isPending = !isCompleted && !isActive;

        return (
          <div
            key={turnNum}
            className={clsx(
              'flex h-[30px] w-[70px] items-center justify-center rounded-[8px] text-[16px] font-normal leading-normal',
              isCompleted && 'bg-[#757a9e] text-gray-40',
              isActive && 'border border-solid border-[#757a9e] bg-white text-[#757a9e]',
              isPending && 'bg-gray-20 text-[#232323]',
            )}
          >
            {isCompleted ? '완료' : `대화 ${turnNum}`}
          </div>
        );
      })}
    </div>
  );
};

