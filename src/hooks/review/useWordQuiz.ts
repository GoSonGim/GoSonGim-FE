import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { logger } from '@/utils/common/loggerUtils';
import { useRandomWordsQuery } from '@/hooks/review/queries/useRandomWordsQuery';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { reviewAPI } from '@/apis/review';
import { lipSoundAPI } from '@/apis/search';
import type { QuizWord } from '@/types/review';

export type WordStatus = 'pending' | 'active' | 'completed';

export const useWordQuiz = () => {
  const { data, isLoading, error } = useRandomWordsQuery();
  const { startRecording: startAudioRecording, stopRecording: stopAudioRecording } = useAudioRecorder();

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
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileKeysRef = useRef<Map<number, string>>(new Map());
  const currentWordIndexRef = useRef(currentWordIndex);

  // currentWordIndex가 변경될 때 ref도 업데이트
  useEffect(() => {
    currentWordIndexRef.current = currentWordIndex;
  }, [currentWordIndex]);

  // words가 변경되면 wordStatuses 초기화
  useEffect(() => {
    if (words.length > 0 && wordStatuses.length === 0) {
      setWordStatuses(words.map((_, index) => (index === 0 ? 'active' : 'pending')));
    }
  }, [words, wordStatuses.length]);

  // S3 업로드 함수
  const uploadToS3 = useCallback(
    async (index: number, blob: Blob): Promise<string> => {
      const word = words[index];
      if (!word) {
        throw new Error(`인덱스 ${index}에 해당하는 단어를 찾을 수 없습니다.`);
      }

      const uuid =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
      const fileName = `word${index + 1}_${uuid}.wav`;

      setIsUploading(true);

      try {
        const uploadResponse = await lipSoundAPI.getUploadUrl({
          folder: 'kit',
          fileName,
        });

        const { fileKey, url } = uploadResponse.result;

        const uploadResult = await fetch(url, {
          method: 'PUT',
          body: blob,
        });

        if (!uploadResult.ok) {
          throw new Error(`S3 업로드 실패 (status: ${uploadResult.status})`);
        }

        logger.log(`${index + 1}번째 단어 녹음 업로드 완료`, fileKey);
        return fileKey;
      } catch (error) {
        logger.error(`${index + 1}번째 단어 녹음 업로드 실패:`, error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [words],
  );

  // 평가 API 호출
  const handleEvaluate = useCallback(
    async (fileKeys: Map<number, string>) => {
      try {
        setIsEvaluating(true);
        logger.log('단어 평가 시작, 총 녹음 파일:', fileKeys.size);

        const payload = Array.from(fileKeys.entries())
          .sort(([a], [b]) => a - b)
          .map(([index, fileKey]) => ({
            kitStageId: index + 1,
            fileKey,
            targetWord: words[index].text,
          }));

        logger.log('단어 평가 요청 페이로드:', JSON.stringify(payload, null, 2));

        const response = await reviewAPI.evaluateWords(payload);
        logger.log('평가 결과:', response);

        const overallScore = Math.floor(response.result.overallResult?.overallScore || 0);
        const overallFeedback = response.result.overallResult?.overallFeedback || '';

        setScore(overallScore);
        setFeedback(overallFeedback);
        setShowScoreModal(true);
      } catch (error) {
        logger.error('단어 평가 실패:', error);
        alert('단어 평가 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsEvaluating(false);
      }
    },
    [words],
  );

  // 다음 단어로 이동
  const moveToNextWord = useCallback(() => {
    const newStatuses = [...wordStatuses];
    newStatuses[currentWordIndex] = 'completed';

    if (currentWordIndex < words.length - 1) {
      newStatuses[currentWordIndex + 1] = 'active';
      setCurrentWordIndex(currentWordIndex + 1);
      setWordStatuses(newStatuses);
    } else {
      // 모든 단어 완료 → 평가 실행
      setWordStatuses(newStatuses);
      if (fileKeysRef.current.size === words.length) {
        handleEvaluate(fileKeysRef.current);
      }
    }
  }, [wordStatuses, currentWordIndex, words.length, handleEvaluate]);

  // 녹음 중지 및 저장 처리
  const handleStopRecordingAndSave = useCallback(async () => {
    try {
      const wavBlob = await stopAudioRecording();

      if (!wavBlob) {
        return;
      }

      const completedIndex = currentWordIndexRef.current;

      setIsRecording(false);
      setProgress(0);

      logger.log(`${completedIndex + 1}번째 단어 녹음 완료:`, {
        index: completedIndex,
        size: wavBlob.size,
        type: wavBlob.type,
      });

      const fileKey = await uploadToS3(completedIndex, wavBlob);

      const updatedFileKeys = new Map(fileKeysRef.current);
      updatedFileKeys.set(completedIndex, fileKey);
      fileKeysRef.current = updatedFileKeys;

      // 다음 단어로 이동 또는 평가 실행
      setTimeout(() => {
        moveToNextWord();
      }, 500);
    } catch (error) {
      logger.error('녹음 저장 또는 업로드 실패:', error);
      alert('녹음 파일을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsRecording(false);
      setProgress(0);
    }
  }, [stopAudioRecording, uploadToS3, moveToNextWord]);

  // 단어 음성 재생
  const playWordAudio = (word: QuizWord) => {
    const encodedFileName = encodeURIComponent(word.text);
    const audioPath = `/audio/review/${encodedFileName}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(audioPath);

    audio.addEventListener(
      'canplaythrough',
      () => {
        audio.play().catch(() => {
          logger.warn(`음성 파일을 재생할 수 없습니다: ${word.text}.mp3`);
        });
      },
      { once: true },
    );

    audio.addEventListener(
      'error',
      () => {
        logger.warn(`음성 파일을 찾을 수 없습니다: ${word.text}.mp3`);
      },
      { once: true },
    );

    audio.load();
    audioRef.current = audio;
  };

  // 인트로 타이머 (1초)
  useEffect(() => {
    if (words.length === 0) return;

    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => {
        playWordAudio(words[0]);
      }, 200);
    }, 1000);
    return () => clearTimeout(timer);
  }, [words]);

  // 녹음 시작
  const handleStartRecording = async () => {
    if (isRecording || isUploading || isEvaluating) return;

    try {
      await startAudioRecording();
      setIsRecording(true);
      setProgress(0);

      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            handleStopRecordingAndSave();
            return 100;
          }
          return prev + 3.33; // 3초 = 3000ms, 100ms마다 3.33% 증가
        });
      }, 100);
    } catch (error) {
      logger.error('녹음 시작 실패:', error);
      alert('마이크 권한이 필요합니다.');
    }
  };

  // 단어 변경 시 음성 재생
  useEffect(() => {
    if (!showIntro && currentWordIndex > 0 && words[currentWordIndex] && !isUploading && !isEvaluating) {
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
    feedback,
    handleStartRecording,
    setShowScoreModal,
    isLoading,
    error,
    isUploading,
    isEvaluating,
  };
};
