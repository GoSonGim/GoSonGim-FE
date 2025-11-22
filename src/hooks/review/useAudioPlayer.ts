import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioPlayerReturn {
  loadAudio: (url: string) => void;
  play: () => void;
  pause: () => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  isLoading: boolean;
  error: string | null;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 오디오 로드
  const loadAudio = useCallback((url: string) => {
    // 기존 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);

    // 새 오디오 생성
    const audio = new Audio(url);
    audioRef.current = audio;

    // 메타데이터 로드 완료
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });

    // 재생 중 시간 업데이트
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    // 재생 종료
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    });

    // 에러 처리
    audio.addEventListener('error', () => {
      setError('오디오를 재생할 수 없습니다');
      setIsLoading(false);
      setIsPlaying(false);
    });
  }, []);

  // 재생
  const play = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch(() => {
        setError('오디오 재생에 실패했습니다');
        setIsPlaying(false);
      });
  }, []);

  // 일시정지
  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // 앞으로 이동 (기본 5초)
  const seekForward = useCallback((seconds = 5) => {
    if (!audioRef.current) return;

    const newTime = Math.min(audioRef.current.currentTime + seconds, audioRef.current.duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  // 뒤로 이동 (기본 5초)
  const seekBackward = useCallback((seconds = 5) => {
    if (!audioRef.current) return;

    const newTime = Math.max(audioRef.current.currentTime - seconds, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    loadAudio,
    play,
    pause,
    seekForward,
    seekBackward,
    isPlaying,
    currentTime,
    duration,
    progress,
    isLoading,
    error,
  };
};
