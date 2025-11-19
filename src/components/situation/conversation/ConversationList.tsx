import { useRef, useEffect } from 'react';
import type { Turn } from '@/types/situation';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  turns: Turn[];
  currentTurnIndex: number;
  isProcessing?: boolean;
}

/**
 * 대화 목록 컴포넌트 (자동 스크롤)
 */
export const ConversationList = ({ turns, currentTurnIndex, isProcessing = false }: ConversationListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [turns, currentTurnIndex, isProcessing]);

  return (
    <div ref={scrollRef} className="hide-scrollbar flex-1 overflow-y-auto px-4 py-4">
      {turns.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-body-01-regular text-gray-60">대화를 시작하세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {turns.map((turn) => (
            <ConversationItem
              key={turn.turnIndex}
              turn={turn}
              showAnswer={turn.turnIndex < currentTurnIndex || turn.answer !== undefined}
            />
          ))}

          {/* 처리 중 로딩 표시 */}
          {isProcessing && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-1 size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                <div className="bg-blue-1 size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                <div className="bg-blue-1 size-2 animate-bounce rounded-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
