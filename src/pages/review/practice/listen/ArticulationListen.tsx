import { useNavigate } from 'react-router-dom';
import CloseIcon from '@/assets/svgs/review/review-close.svg';
import StopIcon from '@/assets/svgs/review/review-stop.svg';
import NextIcon from '@/assets/svgs/review/review-time2.svg';
import PrevIcon from '@/assets/svgs/review/review-time1.svg';
import StartIcon from '@/assets/svgs/review/review-play.svg';
import BlueSelect from '@/assets/svgs/review/review-blueselect.svg';
import ProgressBar from '@/components/review/ProgressBar';
import { useArticulationPracticeListen } from '@/hooks/review/useArticulationPracticeListen';

const ArticulationPracticeListen = () => {
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
  } = useArticulationPracticeListen();

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 메뉴 상단바 */}
      <div className="relative flex h-16 items-center justify-center bg-white">
        <button onClick={() => navigate(-1)} className="absolute left-4 flex size-12 items-center justify-center p-2">
          <CloseIcon className="size-[48px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">목구멍 소리 키트</h1>
      </div>

      {/* 여백 */}
      <div className="bg-background-primary h-2" />

      {/* 점수 및 피드백 영역 */}
      <div className="relative bg-white px-4 pt-[14px] pb-[32px]">
        <p className="text-heading-01-semibold mb-[16px] text-gray-100">76점</p>
        <div className="relative flex gap-[10px]">
          {/* 세로선 */}
          <div className="h-[92.5px] w-px bg-gray-20" />
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

      {/* 대화 내역 - 사용자 메시지만 */}
      <div className="flex flex-1 flex-col gap-10 overflow-y-auto bg-white px-[33px] py-[23px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dialogues.map((dialogue) => {
          const isSelected = dialogue.id === selectedDialogueId;

          return (
            <div key={dialogue.id} className="relative">
              <button
                onClick={() => handleDialogueClick(dialogue.id)}
                className={`flex w-[344px] flex-col gap-2 rounded-lg px-4 py-2 ${
                  isSelected ? 'bg-background-primary' : 'bg-white'
                }`}
              >
                <p className="text-body-02-regular text-left text-gray-40">
                  {dialogue.userName} <span className="text-blue-2">( 학습 {dialogue.learningNumber} )</span>
                </p>
                <p className="text-heading-02-semibold text-left text-gray-100">{dialogue.text}</p>
              </button>

              {/* 파란색 화살표 */}
              {isSelected && (
                <div className="absolute left-[-25px] top-[70%] -translate-y-1/2">
                  <BlueSelect className="h-[17px] w-[15px]" />
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

export default ArticulationPracticeListen;

