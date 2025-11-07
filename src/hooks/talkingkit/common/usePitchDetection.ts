import { useState, useRef, useCallback } from 'react';
import { PitchDetector } from 'pitchy';
import type { PitchData, PitchDetectionState } from '@/types/talkingkit/pitch';
import { evaluatePitch, frequencyToNote, isSoundLoudEnough } from '@/utils/talkingkit/pitchEvaluation';
import { logger } from '@/utils/loggerUtils';
import { handleError } from '@/utils/errorHandlerUtils';
import {
  AUDIO_FFT_SIZE,
  AUDIO_SMOOTHING_TIME_CONSTANT,
  LOUDNESS_DETECTION_THRESHOLD,
  AUDIO_CONFIG,
} from '@/constants/talkingkit/audio';

interface PitchDetectionOptions {
  maxDuration?: number; // 최대 감지 시간 (ms)
  minDuration?: number; // 최소 감지 시간 (ms)
  updateInterval?: number; // 업데이트 간격 (ms)
}

export const usePitchDetection = (options: PitchDetectionOptions = {}) => {
  const { maxDuration = 30000, minDuration = 2000, updateInterval = 100 } = options;

  const [state, setState] = useState<PitchDetectionState>({
    isDetecting: false,
    isPaused: false,
    detectionTime: 0,
    pitchDataList: [],
    baselineFrequency: null,
    evaluationResult: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pitchDetectorRef = useRef<PitchDetector<Float32Array> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const detectPitch = useCallback(() => {
    if (!analyserRef.current || !pitchDetectorRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const detector = pitchDetectorRef.current;

    // 오디오 데이터 가져오기
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    // RMS (음량) 계산
    const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / buffer.length);

    // 음량이 충분한 경우에만 음정 감지
    if (isSoundLoudEnough(rms, LOUDNESS_DETECTION_THRESHOLD)) {
      const [frequency, clarity] = detector.findPitch(buffer, audioContextRef.current.sampleRate);

      // 주파수가 80Hz 이상이고 신뢰도가 높은 경우에만 처리
      if (frequency && frequency >= 80 && clarity > 0.9) {
        const currentTime = Date.now() - startTimeRef.current;
        const note = frequencyToNote(frequency);

        const pitchData: PitchData = {
          time: currentTime,
          frequency,
          note,
          clarity,
        };

        setState((prev) => {
          const newPitchDataList = [...prev.pitchDataList, pitchData];

          // 첫 음정을 기준으로 설정 (80Hz 이상일 때만)
          const newBaselineFrequency = prev.baselineFrequency === null ? frequency : prev.baselineFrequency;

          return {
            ...prev,
            pitchDataList: newPitchDataList,
            baselineFrequency: newBaselineFrequency,
          };
        });
      }
    }

    // 다음 프레임 요청
    animationFrameRef.current = requestAnimationFrame(detectPitch);
  }, []);

  const startDetection = useCallback(async () => {
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

      // PitchDetector 생성
      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      pitchDetectorRef.current = detector;

      // 감지 시작
      startTimeRef.current = Date.now();
      setState((prev) => ({
        ...prev,
        isDetecting: true,
        detectionTime: 0,
        pitchDataList: [],
        baselineFrequency: null,
        evaluationResult: null,
      }));

      // 음정 감지 시작
      detectPitch();

      // 타이머 시작
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setState((prev) => ({ ...prev, detectionTime: elapsed }));

        // 최대 시간 도달 시 자동 중지
        if (elapsed >= maxDuration) {
          stopDetection();
        }
      }, updateInterval);
    } catch (error) {
      logger.error('Failed to start pitch detection:', error);
      throw new Error(handleError(error));
    }
  }, [maxDuration, updateInterval, detectPitch]);

  const stopDetection = useCallback(() => {
    // 애니메이션 프레임 중지
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 타이머 중지
    if (timerRef.current) {
      clearInterval(timerRef.current);
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

    setState((prev) => {
      const elapsed = Date.now() - startTimeRef.current;

      // 최소 시간 체크
      if (elapsed < minDuration) {
        return {
          ...prev,
          isDetecting: false,
          evaluationResult: {
            score: 0,
            standardDeviation: 0,
            inRangePercentage: 0,
            averageFrequency: 0,
            baselineFrequency: prev.baselineFrequency || 0,
            feedback: `최소 ${minDuration / 1000}초 이상 소리를 내주세요.`,
            isSuccess: false,
          },
        };
      }

      // 평가 수행
      const evaluationResult =
        prev.baselineFrequency && prev.pitchDataList.length > 0
          ? evaluatePitch(prev.pitchDataList, prev.baselineFrequency)
          : {
              score: 0,
              standardDeviation: 0,
              inRangePercentage: 0,
              averageFrequency: 0,
              baselineFrequency: prev.baselineFrequency || 0,
              feedback: '음성이 감지되지 않았습니다. 더 크게 소리내주세요.',
              isSuccess: false,
            };

      return {
        ...prev,
        isDetecting: false,
        evaluationResult,
      };
    });
  }, [minDuration]);

  const resetDetection = useCallback(() => {
    setState({
      isDetecting: false,
      isPaused: false,
      detectionTime: 0,
      pitchDataList: [],
      baselineFrequency: null,
      evaluationResult: null,
    });
  }, []);

  return {
    ...state,
    startDetection,
    stopDetection,
    resetDetection,
  };
};
