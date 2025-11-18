import clsx from 'clsx';

interface PracticeSessionProps {
  sentence: string;
  practiceCount: number;
  maxPracticeCount: number;
  isRecording: boolean;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

/**
 * 연습 세션 컴포넌트 (듣기 + 녹음)
 * Figma: 601-4227
 */
export const PracticeSession = ({
  sentence,
  practiceCount,
  maxPracticeCount,
  isRecording,
  isSpeaking,
  onSpeak,
  onStartRecording,
  onStopRecording,
}: PracticeSessionProps) => {
  const isCompleted = practiceCount >= maxPracticeCount;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 진행 상태 */}
      <div className="flex items-center justify-center gap-2">
        {[...Array(maxPracticeCount)].map((_, index) => (
          <div
            key={index}
            className={clsx(
              'h-2 w-16 rounded-full transition-colors',
              index < practiceCount ? 'bg-blue-1' : 'bg-gray-20',
            )}
          />
        ))}
      </div>

      {/* 문장 표시 */}
      <div className="rounded-[12px] bg-white p-6 shadow-sm">
        <p className="text-body-01-medium whitespace-pre-wrap text-center leading-relaxed text-gray-100">
          {sentence}
        </p>
      </div>

      {/* 버튼들 */}
      <div className="flex flex-col gap-4">
        {/* 듣기 버튼 */}
        <button
          onClick={onSpeak}
          disabled={isSpeaking || isRecording || isCompleted}
          className={clsx(
            'text-body-01-semibold flex h-12 items-center justify-center gap-2 rounded-[8px] transition-colors',
            isSpeaking || isRecording || isCompleted
              ? 'bg-gray-20 cursor-not-allowed text-gray-60'
              : 'bg-blue-1 hover:bg-blue-1-hover cursor-pointer text-white',
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9V15C3 15.55 3.45 16 4 16H7L10.29 19.29C10.92 19.92 12 19.47 12 18.58V5.41C12 4.52 10.92 4.07 10.29 4.7L7 8H4C3.45 8 3 8.45 3 9Z"
              fill="currentColor"
            />
            <path
              d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z"
              fill="currentColor"
            />
            <path
              d="M14 4.45V6.51C16.89 7.33 19 9.96 19 13C19 16.04 16.89 18.67 14 19.49V21.55C18.01 20.68 21 17.11 21 13C21 8.89 18.01 5.32 14 4.45Z"
              fill="currentColor"
            />
          </svg>
          {isSpeaking ? '재생 중...' : '듣기'}
        </button>

        {/* 녹음 버튼 */}
        {!isCompleted && (
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={isSpeaking}
            className={clsx(
              'text-body-01-semibold flex h-12 items-center justify-center gap-2 rounded-[8px] transition-colors',
              isRecording
                ? 'cursor-pointer bg-red-500 text-white hover:bg-red-600'
                : isSpeaking
                  ? 'bg-gray-20 cursor-not-allowed text-gray-60'
                  : 'border-blue-1 text-blue-1 hover:bg-blue-1 cursor-pointer border border-solid hover:text-white',
            )}
          >
            {isRecording ? (
              <>
                <div className="size-3 rounded-sm bg-white" />
                녹음 중지
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z"
                    fill="currentColor"
                  />
                </svg>
                녹음하기 ({practiceCount + 1}/{maxPracticeCount})
              </>
            )}
          </button>
        )}
      </div>

      {/* 완료 메시지 */}
      {isCompleted && (
        <div className="bg-blue-1/10 rounded-[12px] p-4">
          <p className="text-body-01-medium text-blue-1 text-center">
            ✓ 연습을 모두 완료했습니다!
          </p>
        </div>
      )}
    </div>
  );
};

