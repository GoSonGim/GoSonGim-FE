import type { Turn } from '@/types/situation';
import clsx from 'clsx';

interface ConversationItemProps {
  turn: Turn;
  showAnswer?: boolean;
}

/**
 * 대화 아이템 컴포넌트 (질문 + 답변)
 */
export const ConversationItem = ({ turn, showAnswer = true }: ConversationItemProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 질문 (아바타) */}
      {turn.question && (
        <div className="flex justify-start">
          <div className="bg-blue-1 flex min-h-[62px] max-w-[361px] items-center justify-center rounded-tl-[2px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] px-4 py-4">
            <p className="text-body-01-regular whitespace-pre-wrap break-words text-center text-white">
              {turn.question}
            </p>
          </div>
        </div>
      )}

      {/* 답변 (사용자) */}
      {showAnswer && turn.answer && (
        <div className="flex justify-end">
          <div
            className={clsx(
              'border-gray-20 flex min-h-[62px] max-w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid px-4 py-4',
              turn.evaluation?.isSuccess === false ? 'bg-red-50' : 'bg-white',
            )}
          >
            <p className="text-body-01-regular text-gray-80 whitespace-pre-wrap break-words text-center">
              {turn.answer}
            </p>
          </div>
        </div>
      )}

      {/* 평가 결과 (있을 경우) */}
      {turn.evaluation && (
        <div className="flex justify-end px-4">
          <div className="flex max-w-[361px] flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'text-caption-01-semibold',
                  turn.evaluation.isSuccess ? 'text-blue-1' : 'text-red-500',
                )}
              >
                {turn.evaluation.isSuccess ? '✓ 정답' : '✗ 오답'}
              </span>
              <span className="text-caption-01-medium text-gray-60">점수: {turn.evaluation.score}점</span>
            </div>
            <p className="text-caption-01-regular text-gray-60">{turn.evaluation.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

