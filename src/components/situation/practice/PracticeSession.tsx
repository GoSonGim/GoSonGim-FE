import clsx from 'clsx';
import { RecordButton } from '@/components/situation/common';

interface PracticeSessionProps {
  sentence: string;
  practiceCount: number;
  maxPracticeCount: number;
  isRecording: boolean;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSentenceChange: (newSentence: string) => void;
}

/**
 * 연습 세션 컴포넌트
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
  onSentenceChange,
}: PracticeSessionProps) => {
  const isCompleted = practiceCount >= maxPracticeCount;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 문장 표시 */}
      <div className="border-blue-1 rounded-[16px] border border-solid bg-white p-2">
        <textarea
          value={sentence}
          onChange={(e) => onSentenceChange(e.target.value)}
          disabled={isCompleted}
          maxLength={100}
          className="text-body-01-regular text-gray-80 w-full resize-none border-0 bg-transparent px-2 py-3 text-center focus:outline-none disabled:opacity-50"
          rows={2}
        />
      </div>

      {/* 차수 표시 */}
      <div className="flex w-full gap-[9px]">
        {[1, 2, 3].map((round) => {
          const isCurrentOrCompleted = round <= practiceCount;
          const isCurrent = round === practiceCount + 1 && !isCompleted;
          const isDisabled = round > practiceCount + 1 || isCompleted;

          return (
            <div
              key={round}
              className={clsx(
                'flex flex-1 items-center justify-center rounded-[8px] px-3 py-[6px]',
                isCurrentOrCompleted && 'bg-blue-1',
                isCurrent && 'border-blue-1 border border-solid bg-white',
                isDisabled && 'bg-gray-20',
              )}
            >
              <p
                className={clsx(
                  'text-body-01-semibold text-center',
                  isCurrentOrCompleted && 'text-white',
                  isCurrent && 'text-blue-1',
                  isDisabled && 'text-gray-40',
                )}
              >
                {isCurrentOrCompleted ? '완료' : `${round}차`}
              </p>
            </div>
          );
        })}
      </div>

      {/* 안내 텍스트 */}
      <div className="text-center">
        <p className="text-body-01-regular text-gray-60">
          AI 아바타의 입모양을 보며
          <br />
          천천히 반복해보세요
        </p>
      </div>

      {/* 듣기 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={onSpeak}
          disabled={isSpeaking || isCompleted}
          className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold h-[48px] w-full max-w-[200px] cursor-pointer rounded-[8px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSpeaking ? '말하는 중...' : '아바타 발음 듣기'}
        </button>
      </div>

      {/* 마이크 버튼 */}
      <div className="flex justify-center">
        <RecordButton
          isRecording={isRecording}
          isDisabled={isSpeaking || isCompleted}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          size="large"
        />
      </div>

      {/* 완료 메시지 */}
      {isCompleted && (
        <div className="bg-blue-1/10 rounded-[12px] p-4">
          <p className="text-body-01-medium text-blue-1 text-center">✓ 연습을 모두 완료했습니다!</p>
        </div>
      )}
    </div>
  );
};
