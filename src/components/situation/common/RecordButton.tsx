import Mike1 from '@/assets/svgs/home/mike1.svg';
import Mike2 from '@/assets/svgs/home/mike2.svg';
import GrayCircle from '@/assets/svgs/home/talkbanned.svg';
import clsx from 'clsx';

interface RecordButtonProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 녹음 버튼 컴포넌트 (FreeTalk 스타일)
 * - 비활성: Mike1 (회색 마이크)
 * - 활성: Mike2 (파란색 마이크)
 * - 녹음 중: GrayCircle (회색 원)
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
    if (isRecording) {
      onStopRecording();
    } else if (!isDisabled) {
      onStartRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled && !isRecording}
      className={clsx(
        'flex items-center justify-center',
        sizeClasses[size],
        isRecording ? 'cursor-default' : isDisabled ? 'cursor-not-allowed opacity-100' : 'cursor-pointer',
      )}
      aria-label={isRecording ? '녹음 중 (자동 종료 대기)' : '녹음하기'}
    >
      {isRecording ? (
        // 녹음 중: 회색 원
        <GrayCircle className={sizeClasses[size]} />
      ) : isDisabled ? (
        // 비활성: Mike1
        <Mike1 className={sizeClasses[size]} />
      ) : (
        // 활성: Mike2
        <Mike2 className={sizeClasses[size]} />
      )}
    </button>
  );
};

