/**
 * 오디오 감지 관련 상수
 */

/** FFT 크기 (Fast Fourier Transform) - 오디오 분석 해상도 */
export const AUDIO_FFT_SIZE = 2048;

/** 스무딩 시간 상수 (0~1) - 값이 클수록 부드러운 전환 */
export const AUDIO_SMOOTHING_TIME_CONSTANT = 0.8;

/** 음성 감지 기본 임계값 (RMS) */
export const VOICE_DETECTION_THRESHOLD = 0.02;

/** 음량 감지 기본 임계값 (RMS) */
export const LOUDNESS_DETECTION_THRESHOLD = 0.01;

/** 오디오 설정 */
export const AUDIO_CONFIG = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
} as const;

