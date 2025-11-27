import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioPlayerReturn {
  loadAndPlay: (url: string) => void; // 통합
  play: () => void;
  pause: () => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  isLoading: boolean;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 오디오 요소 정리 (이벤트 리스너 포함)
  const cleanupAudio = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // 이벤트 리스너 명시적 제거
    audio.onloadedmetadata = null;
    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onerror = null;

    // 재생 중지 및 참조 제거
    audio.pause();
    audioRef.current = null;
  }, []);

  // iOS 통과형: 로드 + 재생 통합
  const loadAndPlay = useCallback(async (url: string) => {
    cleanupAudio();

    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);

    // iOS에서 new Audio() 대신 이 방식이 더 안정적
    const audio = document.createElement('audio');
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata'; // ✅ auto ❌
    audio.src = url;
    audio.load(); // ✅ iOS 필수

    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    try {
      const p = audio.play(); // ✅ 클릭 콜스택 안에서 실행됨
      if (p instanceof Promise) await p;
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [cleanupAudio]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      const p = audioRef.current.play();
      if (p instanceof Promise) await p;
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const seekForward = useCallback((seconds = 5) => {
    if (!audioRef.current) return;

    const newTime = Math.min(
      audioRef.current.currentTime + seconds,
      audioRef.current.duration,
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const seekBackward = useCallback((seconds = 5) => {
    if (!audioRef.current) return;

    const newTime = Math.max(
      audioRef.current.currentTime - seconds,
      0,
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    loadAndPlay, // ✅ 새로 노출
    play,
    pause,
    seekForward,
    seekBackward,
    isPlaying,
    currentTime,
    duration,
    progress,
    isLoading,
  };
};