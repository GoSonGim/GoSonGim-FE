// 진단 녹음 관련 상수
export const DIAGNOSIS_RECORDING = {
  DURATION: 8000, // 8초
  INTERVAL: 50, // 50ms마다 업데이트
  get INCREMENT() {
    return (this.INTERVAL / this.DURATION) * 100;
  },
} as const;

// 진단 단계 타입
export type DiagnosisStepType = 'start' | 'loading' | 'result';

