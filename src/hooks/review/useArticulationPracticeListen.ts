import { useState, useEffect } from 'react';
import { MOCK_ARTICULATION_DIALOGUES } from '@/mock/review/articulationPracticeListen.mock';

const TOTAL_DURATION = 7000; // 7초 (ms)
const PROGRESS_INTERVAL = 100; // 100ms마다 업데이트
const SKIP_SECONDS = 5; // 5초 스킵
const SKIP_PERCENTAGE = (SKIP_SECONDS / (TOTAL_DURATION / 1000)) * 100; // 약 71.4%

export const useArticulationPracticeListen = () => {
  const [selectedDialogueId, setSelectedDialogueId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100

  // mock 데이터에서 대화 가져오기
  const dialogues = MOCK_ARTICULATION_DIALOGUES;

  // 타이머 로직
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          setSelectedDialogueId(null); // 타이머 종료 시 선택 해제 (배경 흰색으로)
          return 0; // progress도 0으로 초기화
        }
        return prev + (PROGRESS_INTERVAL / TOTAL_DURATION) * 100;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // 대화 박스 클릭 핸들러
  const handleDialogueClick = (dialogueId: number) => {
    setSelectedDialogueId(dialogueId);
    setProgress(0);
    setIsPlaying(true);
  };

  // 재생/정지 토글
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 5초 뒤로 가기
  const handlePrevious = () => {
    setProgress((prev) => Math.max(0, prev - SKIP_PERCENTAGE));
  };

  // 5초 앞으로 가기
  const handleNext = () => {
    setProgress((prev) => Math.min(100, prev + SKIP_PERCENTAGE));
  };

  return {
    selectedDialogueId,
    isPlaying,
    progress,
    dialogues,
    handleDialogueClick,
    handlePlayPause,
    handlePrevious,
    handleNext,
  };
};

