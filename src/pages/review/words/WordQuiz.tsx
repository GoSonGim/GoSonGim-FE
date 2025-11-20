import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import LeftIcon from '@/assets/svgs/review/review-leftarrow.svg';
import GrayAudio from '@/assets/svgs/review/mike1.svg';
import BlueAudio from '@/assets/svgs/review/mike2.svg';
import BlueCircle from '@/assets/svgs/review/bluecircle.svg';
import WhiteSquare from '@/assets/svgs/review/whitesquare.svg';
import CircularProgress from '@/components/freetalk/CircularProgress';
import ScoreModal from '@/components/review/ScoreModal';
import { useWordQuiz } from '@/hooks/review/useWordQuiz';
import type { WordStatus } from '@/hooks/review/useWordQuiz';

const WordBox = ({ status, label }: { status: WordStatus; label: string }) => {
  return (
    <div
      className={clsx(
        'flex h-10 w-[68px] items-center justify-center rounded-lg px-3 py-1.5',
        status === 'active' && 'border-blue-1 border bg-white',
        status === 'pending' && 'bg-gray-20',
        status === 'completed' && 'bg-blue-1',
      )}
    >
      <p
        className={clsx(
          'text-body-01-regular text-center whitespace-nowrap',
          status === 'active' && 'text-blue-1 font-semibold',
          status === 'pending' && 'text-gray-40',
          status === 'completed' && 'text-white',
        )}
      >
        {status === 'completed' ? '완료' : label}
      </p>
    </div>
  );
};

const WordQuiz = () => {
  const navigate = useNavigate();
  const {
    showIntro,
    words,
    currentWord,
    wordStatuses,
    isRecording,
    progress,
    showScoreModal,
    score,
    handleStartRecording,
    setShowScoreModal,
    isLoading,
    error,
  } = useWordQuiz();

  // 404 에러 체크 (학습 기록이 없는 경우)
  const isNoDataError = error instanceof AxiosError && error.response?.status === 404;

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex h-16 items-center justify-center bg-white px-4">
        <button onClick={() => navigate('/review')} className="absolute left-4 cursor-pointer p-2">
          <LeftIcon className="h-[18px] w-[10px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">단어 복습 랜덤퀴즈</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex flex-1 flex-col items-center gap-4 overflow-y-auto pt-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 중앙 박스 */}
        {isLoading ? (
          // 로딩 상태
          <div className="flex h-[186px] w-[361px] items-center justify-center rounded-2xl bg-white p-4">
            <p className="text-body-01-regular text-gray-80 text-center">로딩 중...</p>
          </div>
        ) : isNoDataError ? (
          // 404 에러 상태
          <div className="flex h-[186px] w-[361px] items-center justify-center rounded-2xl bg-white p-4">
            <p className="text-body-01-regular text-gray-80 text-center">
              학습 기록이 없습니다
              <br />
              단어 학습을 먼저 진행해주세요
            </p>
          </div>
        ) : showIntro ? (
          // 인트로 페이지
          <div className="flex h-[186px] w-[361px] items-center justify-center rounded-2xl bg-white p-4">
            <p className="text-body-01-regular text-gray-80 text-center">
              소리를 잘 듣고
              <br />
              음성 버튼을 눌러 단어를 발음해주세요
              <br />
              녹음은 한번 씩만 진행할 수 있습니다.
            </p>
          </div>
        ) : (
          // 메인 퀴즈 페이지
          <div className="relative h-[186px] w-[361px] rounded-2xl bg-white p-4">
            {/* 명사 - 절대 위치로 정확하게 배치 */}
            <p className="text-body-01-regular text-gray-40 absolute top-4 left-4">{currentWord?.category}</p>

            {/* 단어 - 박스 중앙 정렬 */}
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-[40px] leading-normal font-semibold text-gray-100">{currentWord?.text}</p>
            </div>
          </div>
        )}

        {/* 단어 상태 박스들 - 실제 단어 개수만 표시 */}
        {!isLoading && !isNoDataError && words.length > 0 && (
          <div className="flex w-[361px] gap-[5px]">
            {words.map((word, index) => (
              <WordBox key={word.id} status={wordStatuses[index]} label={`단어 ${index + 1}`} />
            ))}
          </div>
        )}
      </main>

      {/* 하단 아이콘 */}
      <div className="absolute bottom-[144px] left-1/2 -translate-x-1/2">
        {showIntro ? (
          // 인트로: 비활성 아이콘
          <GrayAudio className="h-[88px] w-[88px]" />
        ) : isRecording ? (
          // 녹음 중: 타이머 + 정지 아이콘
          <div className="relative h-[88px] w-[88px]">
            {/* 중앙 아이콘 (파란 원 + 하얀 사각형) */}
            <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <BlueCircle className="h-[88px] w-[88px]" />
              <WhiteSquare className="absolute top-1/2 left-1/2 h-[24px] w-[24px] -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/* CircularProgress를 최상단에 */}
            <div className="absolute inset-0 z-20">
              <CircularProgress progress={progress} size={88} strokeWidth={8} />
            </div>
          </div>
        ) : (
          // 활성 상태: 클릭 가능한 아이콘
          <button onClick={handleStartRecording} className="cursor-pointer">
            <BlueAudio className="h-[88px] w-[88px]" />
          </button>
        )}
      </div>

      {/* 점수 모달 */}
      <ScoreModal isOpen={showScoreModal} score={score} onClose={() => setShowScoreModal(false)} />
    </div>
  );
};

export default WordQuiz;
