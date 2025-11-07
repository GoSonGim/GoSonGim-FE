import { useRef, useCallback } from 'react';
import { logger } from '@/utils/loggerUtils';
import { handleError } from '@/utils/errorHandlerUtils';
import {
  AUDIO_FFT_SIZE,
  AUDIO_SMOOTHING_TIME_CONSTANT,
  VOICE_DETECTION_THRESHOLD,
  AUDIO_CONFIG,
} from '@/constants/talkingkit/audio';

interface VoiceDetectionOptions {
  onVoiceDetected: (timestamp: number) => void;
  threshold?: number; // RMS 임계값 (기본값: VOICE_DETECTION_THRESHOLD)
}

export const useVoiceDetection = ({ onVoiceDetected, threshold = VOICE_DETECTION_THRESHOLD }: VoiceDetectionOptions) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isDetectingRef = useRef<boolean>(false);

  const detectVoice = useCallback(() => {
    if (!analyserRef.current || !isDetectingRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(dataArray);

    // RMS (Root Mean Square) 계산
    const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / dataArray.length);

    // 임계값 초과 시 콜백 호출
    if (rms > threshold) {
      const currentTime = Date.now() - startTimeRef.current;
      onVoiceDetected(currentTime);
    }

    // 다음 프레임 요청
    animationFrameRef.current = requestAnimationFrame(detectVoice);
  }, [onVoiceDetected, threshold]);

  const start = useCallback(async () => {
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONFIG,
      });

      streamRef.current = stream;

      // AudioContext 생성
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Analyser 노드 생성
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = AUDIO_FFT_SIZE;
      analyser.smoothingTimeConstant = AUDIO_SMOOTHING_TIME_CONSTANT;
      analyserRef.current = analyser;

      // 마이크 입력 연결
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // 감지 시작
      startTimeRef.current = Date.now();
      isDetectingRef.current = true;
      detectVoice();
    } catch (error) {
      logger.error('Failed to start voice detection:', error);
      throw new Error(handleError(error));
    }
  }, [detectVoice]);

  const stop = useCallback(() => {
    isDetectingRef.current = false;

    // 애니메이션 프레임 중지
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 오디오 스트림 중지
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // AudioContext 닫기
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  return {
    start,
    stop,
    isDetecting: isDetectingRef.current,
  };
};
