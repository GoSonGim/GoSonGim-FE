import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CloseIcon from '@/assets/svgs/review/review-close.svg';
import StopIcon from '@/assets/svgs/review/review-stop.svg';
import NextIcon from '@/assets/svgs/review/review-time2.svg';
import PrevIcon from '@/assets/svgs/review/review-time1.svg';
import StartIcon from '@/assets/svgs/review/review-play.svg';
import BlueSelect from '@/assets/svgs/review/review-blueselect.svg';
import ProgressBar from '@/components/review/ProgressBar';
import { useKitDetailQuery } from '@/hooks/review/queries/useKitDetailQuery';
import { useAudioPlayer } from '@/hooks/review/useAudioPlayer';

const ArticulationListen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kitId = Number(searchParams.get('kitId')) || 0;

  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  // API 데이터 가져오기
  const { data, isLoading, isError } = useKitDetailQuery(kitId);

  // 오디오 플레이어
  const { loadAudio, play, pause, seekForward, seekBackward, isPlaying, progress } = useAudioPlayer();

  // 녹음 선택 핸들러
  const handleRecordClick = (recordId: number, audioUrl: string) => {
    setSelectedRecordId(recordId);
    loadAudio(audioUrl);
    play();
  };

  // 재생/정지 토글
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // 5초 뒤로
  const handlePrevious = () => {
    seekBackward(5);
  };

  // 5초 앞으로
  const handleNext = () => {
    seekForward(5);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-body-01-regular text-gray-60">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-body-01-regular text-gray-60">녹음을 불러올 수 없습니다</p>
        <button onClick={() => navigate(-1)} className="text-body-02-regular text-blue-2">
          돌아가기
        </button>
      </div>
    );
  }

  const { kitName, records } = data.result;

  // 평균 점수 계산
  const averageScore =
    records.length > 0 ? Math.round(records.reduce((sum, record) => sum + record.evaluationScore, 0) / records.length) : 0;

  // 대표 피드백 (첫 번째 레코드의 피드백 사용)
  const representativeFeedback = records.length > 0 ? records[0].evaluationFeedback : '피드백이 없습니다';

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 메뉴 상단바 */}
      <div className="relative flex h-16 items-center justify-center bg-white">
        <button onClick={() => navigate(-1)} className="absolute left-4 flex size-12 items-center justify-center p-2">
          <CloseIcon className="size-[48px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">{kitName}</h1>
      </div>

      {/* 여백 */}
      <div className="bg-background-primary h-2" />

      {/* 점수 및 피드백 영역 */}
      <div className="relative bg-white px-4 pt-[14px] pb-[32px]">
        <p className="text-heading-01-semibold mb-[16px] text-gray-100">{averageScore}점</p>
        <div className="relative flex gap-[10px]">
          {/* 세로선 */}
          <div className="h-auto w-px bg-gray-20" />
          {/* 피드백 텍스트 */}
          <div className="text-body-01-regular text-gray-100">
            <p className="whitespace-pre-wrap">{representativeFeedback}</p>
          </div>
        </div>
      </div>

      {/* 여백 */}
      <div className="bg-background-primary h-2" />

      {/* 녹음 목록 */}
      <div className="flex flex-1 flex-col gap-10 overflow-y-auto bg-white px-[33px] py-[23px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {records.map((record, index) => {
          const isSelected = record.id === selectedRecordId;

          return (
            <div key={record.id} className="relative">
              <button
                onClick={() => handleRecordClick(record.id, record.audioFileUrl)}
                className={`flex w-[344px] flex-col gap-2 rounded-lg px-4 py-2 ${
                  isSelected ? 'bg-background-primary' : 'bg-white'
                }`}
              >
                <p className="text-body-02-regular text-left text-gray-40">
                  {record.kitStageName} <span className="text-blue-2">( 학습 {index + 1} )</span>
                </p>
                <p className="text-heading-02-semibold text-left text-gray-100">{record.targetWord}</p>
                <p className="text-body-02-regular text-left text-gray-60">{record.evaluationScore}점</p>
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
        <button onClick={handlePrevious} className="flex size-[31px] items-center justify-center" disabled={!isPlaying}>
          <PrevIcon className="size-[31px]" />
        </button>

        {/* 재생/정지 */}
        <button
          onClick={handlePlayPause}
          className="flex size-[45px] items-center justify-center"
          disabled={selectedRecordId === null}
        >
          {isPlaying ? <StartIcon className="size-[45px]" /> : <StopIcon className="size-[45px]" />}
        </button>

        {/* 5초 앞으로가기 */}
        <button onClick={handleNext} className="flex size-[31px] items-center justify-center" disabled={!isPlaying}>
          <NextIcon className="size-[31px]" />
        </button>
      </div>
    </div>
  );
};

export default ArticulationListen;
