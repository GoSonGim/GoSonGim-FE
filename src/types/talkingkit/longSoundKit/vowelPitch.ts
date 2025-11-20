export interface PitchData {
  time: number; // 시간 (ms)
  frequency: number; // 주파수 (Hz)
  note: string; // 음정 이름 (예: A4, C5)
  clarity: number; // 음정 신뢰도 (0-1)
}

export interface PitchEvaluationResult {
  score: number; // 종합 점수 (0-100)
  standardDeviation: number; // 표준편차 (Hz)
  inRangePercentage: number; // 범위 내 시간 비율 (0-100)
  averageFrequency: number; // 평균 주파수 (Hz)
  baselineFrequency: number; // 기준 주파수 (첫 음정)
  feedback: string; // 피드백 메시지
  isSuccess: boolean; // 성공 여부
}

export interface PitchDetectionState {
  isDetecting: boolean;
  isPaused: boolean;
  detectionTime: number;
  pitchDataList: PitchData[];
  baselineFrequency: number | null;
  evaluationResult: PitchEvaluationResult | null;
}
