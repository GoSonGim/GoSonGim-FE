import type { FinalSummary } from '@/types/situation';
import clsx from 'clsx';

interface FeedbackCardProps {
  finalSummary: FinalSummary;
  onComplete: () => void;
}

/**
 * 최종 피드백 카드 컴포넌트
 */
export const FeedbackCard = ({ finalSummary, onComplete }: FeedbackCardProps) => {
  const { averageScore, finalFeedback } = finalSummary;

  // 점수에 따른 등급 및 색상
  const getGrade = (score: number) => {
    if (score >= 95) return { grade: '최고예요!', color: 'text-blue-1', emoji: '🎉' };
    if (score >= 90) return { grade: '훌륭해요!', color: 'text-blue-1', emoji: '😊' };
    if (score >= 80) return { grade: '잘했어요!', color: 'text-green-500', emoji: '👍' };
    if (score >= 70) return { grade: '괜찮아요', color: 'text-yellow-500', emoji: '😐' };
    return { grade: '다시 도전!', color: 'text-orange-500', emoji: '💪' };
  };

  const { grade, color, emoji } = getGrade(averageScore);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-8">
      {/* 이모지 */}
      <div className="mb-6 text-6xl">{emoji}</div>

      {/* 등급 */}
      <h1 className={clsx('text-heading-01-bold mb-2', color)}>{grade}</h1>

      {/* 평균 점수 */}
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-display-01-bold text-gray-100">{averageScore.toFixed(1)}</span>
        <span className="text-body-01-medium text-gray-60">/ 100점</span>
      </div>

      {/* 피드백 메시지 */}
      <div className="mb-8 w-full max-w-[400px] rounded-[12px] bg-white p-6 shadow-sm">
        <p className="text-body-01-regular text-gray-80 text-center leading-relaxed whitespace-pre-wrap">
          {finalFeedback}
        </p>
      </div>

      {/* 완료 버튼 */}
      <button
        onClick={onComplete}
        className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold h-12 w-full max-w-[200px] cursor-pointer rounded-[8px] text-white transition-colors"
      >
        완료
      </button>
    </div>
  );
};
