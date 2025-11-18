import clsx from 'clsx';

interface RecordButtonProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 녹음 버튼 컴포넌트
 * - 비활성: 회색 마이크 아이콘
 * - 활성: 파란색 마이크 아이콘
 * - 녹음 중: 빨간 원 (정지 버튼)
 */
export const RecordButton = ({
  isRecording,
  isDisabled = false,
  onStartRecording,
  onStopRecording,
  size = 'large',
}: RecordButtonProps) => {
  const sizeClasses = {
    small: 'size-[60px]',
    medium: 'size-[72px]',
    large: 'size-[88px]',
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled && !isRecording}
      className={clsx(
        'flex items-center justify-center rounded-full transition-all',
        sizeClasses[size],
        isRecording ? 'cursor-pointer' : isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105',
      )}
      aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
    >
      {isRecording ? (
        // 녹음 중: 빨간 원 (정지 버튼)
        <div className="flex size-full items-center justify-center rounded-full bg-red-500 shadow-lg">
          <div className="size-6 rounded-sm bg-white" />
        </div>
      ) : (
        // 대기 중: 마이크 아이콘
        <div
          className={clsx(
            'flex size-full items-center justify-center rounded-full shadow-md',
            isDisabled ? 'bg-gray-40' : 'bg-blue-1',
          )}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
              fill="white"
            />
            <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="white" />
          </svg>
        </div>
      )}
    </button>
  );
};

