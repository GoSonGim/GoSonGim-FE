// ===== Lip Sound Evaluation =====

export interface PresignedUploadResponse {
  fileKey: string;
  url: string;
  expiresIn: number;
}

export interface PresignedUploadResult {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: PresignedUploadResponse;
}

export interface LipSoundEvaluationRequestItem {
  kitStageId: number; // 1, 2, 3
  fileKey: string; // 업로드된 파일 경로
  targetWord: string; // 한글 단어 (예: "사과")
}

export type LipSoundEvaluationRequest = LipSoundEvaluationRequestItem[];

export interface PronunciationScores {
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

export interface LipSoundIndividualResult {
  kitStageId: number;
  targetWord: string;
  recognizedText: string;
  pronunciation: PronunciationScores;
  evaluationScore: number;
  isSuccess: boolean;
  downloadFileKey?: string;
}

export interface LipSoundOverallResult {
  overallScore: number;
  overallFeedback: string;
}

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
