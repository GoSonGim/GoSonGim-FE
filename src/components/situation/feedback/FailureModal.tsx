import { useEffect } from 'react';

interface FailureModalProps {
  isOpen: boolean;
  feedback: string;
  score: number;
  onClose: () => void;
  onPractice: () => void;
}

/**
 * 평가 실패 모달 컴포넌트
 * Figma: 394-2223
 */
export const FailureModal = ({ isOpen, feedback, score, onClose, onPractice }: FailureModalProps) => {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="relative z-10 mx-4 w-full max-w-[360px] rounded-[16px] bg-white p-6 shadow-xl">
        {/* 아이콘 */}
        <div className="mb-4 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                fill="#EF4444"
              />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-heading-01-bold mb-2 text-center text-gray-100">아쉬워요!</h2>

        {/* 점수 */}
        <p className="text-body-01-semibold text-gray-80 mb-4 text-center">점수: {score}점</p>

        {/* 피드백 */}
        <div className="bg-gray-10 mb-6 rounded-[8px] p-4">
          <p className="text-body-02-regular text-gray-80 text-center whitespace-pre-wrap">{feedback}</p>
        </div>

        {/* 버튼들 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPractice}
            className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold h-12 rounded-[8px] text-white transition-colors"
          >
            연습하기
          </button>
          <button
            onClick={onClose}
            className="text-body-01-semibold border-gray-20 text-gray-80 hover:bg-gray-10 h-12 rounded-[8px] border border-solid transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
