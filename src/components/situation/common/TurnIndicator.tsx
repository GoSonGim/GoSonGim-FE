import clsx from 'clsx';

interface TurnIndicatorProps {
  currentTurn: number;
  totalTurns: number;
}

/**
 * 상황극 턴 표시 컴포넌트
 * 예: "1 / 5", "2 / 5", ...
 */
export const TurnIndicator = ({ currentTurn, totalTurns }: TurnIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className={clsx('text-heading-01-bold', currentTurn > 0 ? 'text-blue-1' : 'text-gray-60')}>
        {currentTurn}
      </span>
      <span className="text-heading-01-medium text-gray-60">/</span>
      <span className="text-heading-01-medium text-gray-60">{totalTurns}</span>
    </div>
  );
};

