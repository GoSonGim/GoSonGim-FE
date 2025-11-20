import type { LipSoundIndividualResult, LipSoundOverallResult } from '../models';

// ===== Lip Sound Evaluation Request =====
export interface LipSoundEvaluationRequestItem {
  kitStageId: number; // 1, 2, 3
  fileKey: string; // 업로드된 파일 경로
  targetWord: string; // 한글 단어 (예: "사과")
}

export type LipSoundEvaluationRequest = LipSoundEvaluationRequestItem[];

// ===== Lip Sound Evaluation Response =====
export interface LipSoundEvaluationResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    individualResults: LipSoundIndividualResult[];
    overallResult?: LipSoundOverallResult;
  };
}
