import { useState, useEffect, useRef } from 'react';
import { MOCK_QUIZ_WORDS } from '@/mock/review/wordQuiz.mock';
import type { QuizWord } from '@/mock/review/wordQuiz.mock';

export type WordStatus = 'pending' | 'active' | 'completed';

export const useWordQuiz = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [words] = useState<QuizWord[]>(MOCK_QUIZ_WORDS);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([
    'active',
    'pending',
    'pending',
    'pending',
    'pending',
  ]);
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

    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch(() => {
      console.warn(`음성 파일을 찾을 수 없습니다: ${word.text}.mp3`);
    });
  };

  // 인트로 타이머 (1초)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      // 인트로 종료 직후 첫 단어 음성 재생
      playWordAudio(words[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    if (!showIntro && currentWordIndex > 0) {
      playWordAudio(words[currentWordIndex]);
    }
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
  };
};
