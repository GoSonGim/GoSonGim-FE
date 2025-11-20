import { useNavigate } from 'react-router-dom';
import CloseIcon from '@/assets/svgs/review/review-close.svg';
import StopIcon from '@/assets/svgs/review/review-stop.svg';
import NextIcon from '@/assets/svgs/review/review-time2.svg';
import PrevIcon from '@/assets/svgs/review/review-time1.svg';
import StartIcon from '@/assets/svgs/review/review-play.svg';
import BlueSelect from '@/assets/svgs/review/review-blueselect.svg';
import ProgressBar from '@/components/review/ProgressBar';
import { useReviewPracticeListen } from '@/hooks/review/useReviewPracticeListen';

const ReviewPracticeListen = () => {
  const navigate = useNavigate();
  const {
    selectedDialogueId,
    isPlaying,
    progress,
    dialogues,
    handleDialogueClick,
    handlePlayPause,
    handlePrevious,
    handleNext,
  } = useReviewPracticeListen();

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 메뉴 상단바 */}
      <div className="relative flex h-16 items-center justify-center bg-white">
        <button onClick={() => navigate(-1)} className="absolute left-4 flex size-12 items-center justify-center p-2">
          <CloseIcon className="size-[48px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">식당에서 음식 주문하기</h1>
      </div>

      {/* 여백 */}
      <div className="bg-background-primary h-2" />

      {/* 점수 및 피드백 영역 */}
      <div className="relative bg-white px-4 pt-[14px] pb-[32px]">
        <p className="text-heading-01-semibold mb-[16px] text-gray-100">76점</p>
        <div className="relative flex gap-[10px]">
          {/* 세로선 */}
          <div className="h-[92.5px] w-px bg-black" />
          {/* 피드백 텍스트 */}
          <div className="text-body-01-regular text-gray-100">
            <p className="mb-0">피드백내용이 줄글로 들어갈까요?</p>
            <p className="mb-0">세줄이면 될까요?</p>
            <p>잘 모르겠네요</p>
          </div>
        </div>
      </div>

      {/* 여백 */}
      <div className="bg-background-primary h-2" />

      {/* 대화 내역 */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-white px-[33px] py-[23px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dialogues.map((dialogue, index) => {
          const isSelected = dialogue.id === selectedDialogueId;
          const showDivider = index === 3; // "학습 진행" 구분선을 3번째 대화 뒤에 표시

          return (
            <div key={dialogue.id}>
              {/* AI 메시지 */}
              {dialogue.speaker === 'AI' && (
                <div className="relative mb-4">
                  <button
                    onClick={() => handleDialogueClick(dialogue.id)}
                    className={`flex w-[344px] flex-col gap-0 rounded-lg px-4 ${
                      isSelected ? 'bg-background-primary py-2' : 'bg-white py-0'
                    }`}
                  >
                    <p className="text-body-02-regular text-gray-40 text-left">AI</p>
                    <p className="text-body-01-regular text-gray-80 text-left">{dialogue.text}</p>
                  </button>

                  {/* 파란색 화살표 */}
                  {isSelected && (
                    <div className="absolute top-[70%] left-[-25px] -translate-y-1/2">
                      <BlueSelect className="h-[17px] w-[15px]" />
                    </div>
                  )}
                </div>
              )}

              {/* 사용자 메시지 */}
              {dialogue.speaker === 'USER' && (
                <div className="relative">
                  <button
                    onClick={() => handleDialogueClick(dialogue.id)}
                    className={`flex w-[344px] flex-col gap-2 rounded-lg px-4 py-2 ${
                      isSelected ? 'bg-background-primary' : 'bg-white'
                    }`}
                  >
                    <p className="text-body-02-regular text-gray-40 text-left">
                      {dialogue.userName} <span className="text-blue-2">( 대화 {dialogue.dialogueNumber} )</span>
                    </p>
                    <p className="text-heading-02-semibold text-left text-gray-100">{dialogue.text}</p>
                  </button>

                  {/* 파란색 화살표 */}
                  {isSelected && (
                    <div className="absolute top-[70%] left-[-25px] -translate-y-1/2">
                      <BlueSelect className="h-[17px] w-[15px]" />
                    </div>
                  )}
                </div>
              )}

              {/* 학습 진행 구분선 */}
              {showDivider && (
                <div className="my-6 flex items-center gap-9">
                  <div className="bg-blue-2 h-1 w-[102.74px] rounded-lg" />
                  <p className="text-body-01-regular text-blue-2 whitespace-nowrap">학습 진행</p>
                  <div className="bg-blue-2 h-1 w-[102.74px] rounded-lg" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 진행바 */}
      <div className="w-full">
        <ProgressBar progress={progress} />
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="relative flex h-[104px] items-center justify-center gap-14 bg-white">
        {/* 5초 뒤로가기 */}
        <button onClick={handlePrevious} className="flex size-[31px] items-center justify-center">
          <PrevIcon className="size-[31px]" />
        </button>

        {/* 재생/정지 */}
        <button onClick={handlePlayPause} className="flex size-[45px] items-center justify-center">
          {isPlaying ? <StartIcon className="size-[45px]" /> : <StopIcon className="size-[45px]" />}
        </button>

        {/* 5초 앞으로가기 */}
        <button onClick={handleNext} className="flex size-[31px] items-center justify-center">
          <NextIcon className="size-[31px]" />
        </button>
      </div>
    </div>
  );
};

export default ReviewPracticeListen;
