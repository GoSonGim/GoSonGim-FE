import { useState, useRef, useCallback } from 'react';
import Meyda from 'meyda';
import { logger } from '@/utils/loggerUtils';
import { handleError } from '@/utils/errorHandlerUtils';
import { AUDIO_FFT_SIZE, AUDIO_SMOOTHING_TIME_CONSTANT, AUDIO_CONFIG } from '@/constants/audio';

interface DecibelDetectionOptions {
  maxDuration?: number; // 최대 녹음 시간 (ms)
  updateInterval?: number; // 업데이트 간격 (ms)
}

export const useDecibelDetection = (options: DecibelDetectionOptions = {}) => {
  const { maxDuration = 4000, updateInterval = 50 } = options;

  const [isDetecting, setIsDetecting] = useState(false);
  const [currentDecibel, setCurrentDecibel] = useState(0);
  const [averageDecibel, setAverageDecibel] = useState(0);
  const [maxDecibel, setMaxDecibel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meydaAnalyzerRef = useRef<Meyda.MeydaAnalyzer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const decibelListRef = useRef<number[]>([]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);

    // Meyda analyzer 중지
    if (meydaAnalyzerRef.current) {
      meydaAnalyzerRef.current.stop();
      meydaAnalyzerRef.current = null;
    }

    // 타이머 중지
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
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

    // 최종 평균 계산 (소리가 감지된 경우에만)
    if (decibelListRef.current.length > 0) {
      const avg = decibelListRef.current.reduce((sum, val) => sum + val, 0) / decibelListRef.current.length;
      setAverageDecibel(Math.max(5, Math.round(avg))); // 최소값 5dB
    } else {
      // 소리가 전혀 감지되지 않은 경우
      setAverageDecibel(5);
      setMaxDecibel(5);
    }
  }, []);

  const startDetection = useCallback(async () => {
    try {
      // 초기화
      decibelListRef.current = [];
      setCurrentDecibel(0);
      setAverageDecibel(0);
      setMaxDecibel(0);
      setIsDetecting(true);

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

      // Meyda analyzer 생성
      const meydaAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        bufferSize: AUDIO_FFT_SIZE,
        featureExtractors: ['rms'],
        callback: (features) => {
          if (features.rms !== undefined && features.rms > 0) {
            // RMS를 데시벨로 변환
            // dB = 20 * log10(RMS) + offset
            // RMS 범위를 0-100dB로 스케일링
            const rmsValue = features.rms;
            
            // 로그 스케일 변환 (0-100 범위로 조정)
            let db = 20 * Math.log10(rmsValue) + 80; // 오프셋 조정
            
            // 추가 스케일링: 음량이 작을 때도 감지되도록
            if (db < 0) {
              db = rmsValue * 250; // 스케일 조정
            }
            
            // 0-100 범위로 제한
            db = Math.max(5, Math.min(100, db)); // 최소값 5, 최대값 100
            const roundedDb = Math.round(db);
            
            // 현재 데시벨 업데이트
            setCurrentDecibel(roundedDb);
            
            // 데이터 리스트에 추가
            decibelListRef.current.push(db);

            // 최대값 업데이트
            setMaxDecibel((prev) => Math.max(prev, roundedDb));
            
            // 평균값 실시간 업데이트
            const currentList = decibelListRef.current;
            if (currentList.length > 0) {
              const avg = currentList.reduce((sum, val) => sum + val, 0) / currentList.length;
              setAverageDecibel(Math.round(avg));
            }
          }
        },
      });

      meydaAnalyzerRef.current = meydaAnalyzer;
      meydaAnalyzer.start();

      // 최대 시간 후 자동 중지
      timerRef.current = window.setTimeout(() => {
        stopDetection();
      }, maxDuration);
    } catch (error) {
      logger.error('Failed to start decibel detection:', error);
      setIsDetecting(false);
      throw new Error(handleError(error));
    }
  }, [maxDuration, stopDetection]);

  const resetDetection = useCallback(() => {
    decibelListRef.current = [];
    setCurrentDecibel(0);
    setAverageDecibel(0);
    setMaxDecibel(0);
    setIsDetecting(false);
  }, []);

  return {
    isDetecting,
    currentDecibel,
    averageDecibel,
    maxDecibel,
    startDetection,
    stopDetection,
    resetDetection,
  };
};
