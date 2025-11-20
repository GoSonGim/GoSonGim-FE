import { useState, useEffect, useRef, useMemo } from 'react';
import { logger } from '@/utils/common/loggerUtils';
import { useRandomWordsQuery } from '@/hooks/review/queries/useRandomWordsQuery';
import type { QuizWord } from '@/types/review';

export type WordStatus = 'pending' | 'active' | 'completed';

export const useWordQuiz = () => {
  const { data, isLoading, error } = useRandomWordsQuery();

  // API 응답에서 상위 5개 단어만 QuizWord 타입으로 변환
  const words = useMemo<QuizWord[]>(() => {
    if (!data?.result?.words) return [];
    return data.result.words.slice(0, 5).map((word, index) => ({
      id: index + 1,
      text: word,
      category: '명사',
    }));
  }, [data]);

  const [showIntro, setShowIntro] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // words 길이에 맞춰 동적으로 wordStatuses 초기화
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);

  // words가 변경되면 wordStatuses 초기화
  useEffect(() => {
    if (words.length > 0 && wordStatuses.length === 0) {
      setWordStatuses(words.map((_, index) => (index === 0 ? 'active' : 'pending')));
    }
  }, [words, wordStatuses.length]);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [score] = useState(70); // 임시 점수

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 단어 음성 재생
  const playWordAudio = (word: QuizWord) => {
    // 한글 파일명 URL 인코딩
    const encodedFileName = encodeURIComponent(word.text);
    const audioPath = `/audio/review/${encodedFileName}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(audioPath);

    // 오디오 파일이 충분히 로드된 후 재생
    audio.addEventListener(
      'canplaythrough',
      () => {
        audio.play().catch(() => {
          logger.warn(`음성 파일을 재생할 수 없습니다: ${word.text}.mp3`);
        });
      },
      { once: true },
    );

    // 로드 에러 처리
    audio.addEventListener(
      'error',
      () => {
        logger.warn(`음성 파일을 찾을 수 없습니다: ${word.text}.mp3`);
      },
      { once: true },
    );

    // 프리로드 시작
    audio.load();
    audioRef.current = audio;
  };

  // 인트로 타이머 (1초)
  useEffect(() => {
    // 단어가 없으면 인트로 타이머 실행하지 않음
    if (words.length === 0) return;

    const timer = setTimeout(() => {
      setShowIntro(false);
      // 인트로 종료 후 약간의 딜레이를 두고 첫 단어 음성 재생
      setTimeout(() => {
        playWordAudio(words[0]);
      }, 200);
    }, 1000);
    return () => clearTimeout(timer);
  }, [words]);

  // 녹음 시작
  const handleStartRecording = () => {
    if (isRecording) return;

    setIsRecording(true);
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          handleStopRecording();
          return 100;
        }
        return prev + 2.5; // 4초 = 4000ms, 100ms마다 2.5% 증가
      });
    }, 100);
  };

  // 녹음 중지 및 다음 단어로 이동
  const handleStopRecording = () => {
    setIsRecording(false);
    setProgress(0);

    // 타이머 종료 후 다음 단어로 자동 이동
    setTimeout(() => {
      moveToNextWord();
    }, 500);
  };

  // 다음 단어로 이동
  const moveToNextWord = () => {
    const newStatuses = [...wordStatuses];
    newStatuses[currentWordIndex] = 'completed';

    if (currentWordIndex < words.length - 1) {
      newStatuses[currentWordIndex + 1] = 'active';
      setCurrentWordIndex(currentWordIndex + 1);
      setWordStatuses(newStatuses);
    } else {
      // 모든 단어 완료 → 모달 표시
      setWordStatuses(newStatuses);
      setTimeout(() => {
        setShowScoreModal(true);
      }, 300);
    }
  };

  // 단어 변경 시 음성 재생
  useEffect(() => {
    if (!showIntro && currentWordIndex > 0 && words[currentWordIndex]) {
      playWordAudio(words[currentWordIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // 오디오 정지
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    showIntro,
    words,
    currentWordIndex,
    currentWord: words[currentWordIndex],
    wordStatuses,
    isRecording,
    progress,
    showScoreModal,
    score,
    handleStartRecording,
    setShowScoreModal,
    isLoading,
    error,
  };
};
