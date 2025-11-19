import { useEffect } from 'react';
import CheckIcon from '@/assets/svgs/situation/checkIconsvg.svg';

interface FailureModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onLearn: () => void;
}

/**
 * 학습 감지 모달 컴포넌트
 * Figma: 601-4079
 */
export const FailureModal = ({ isOpen, onRetry, onLearn }: FailureModalProps) => {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onRetry();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onRetry]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onRetry} />

      {/* 모달 컨텐츠 */}
      <div className="relative z-10 mx-4 w-full max-w-[312px] rounded-[16px] bg-white px-4 py-6 shadow-xl">
        {/* 컨텐츠 영역 */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {/* 틱 아이콘 */}
          <div className="flex size-16 items-center justify-center">
            <CheckIcon className="size-16" />
          </div>

          {/* 텍스트 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-body-01-semibold text-gray-100">학습이 필요함을 감지했어요</p>
            <p className="text-body-02-regular text-gray-100">AI 아바타와 함께 문장을 연습해봐요</p>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex w-full gap-2">
          <button
            onClick={onRetry}
            className="text-body-01-regular hover:bg-gray-30 bg-gray-20 text-gray-80 flex h-12 w-[152px] items-center justify-center rounded-[8px] transition-colors"
          >
            다시하기
          </button>
          <button
            onClick={onLearn}
            className="text-body-01-regular hover:bg-blue-1-hover bg-blue-1 flex h-12 w-[152px] items-center justify-center rounded-[8px] text-white transition-colors"
          >
            학습하기
          </button>
        </div>
      </div>
    </div>
  );
};
