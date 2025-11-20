// ===== Pronunciation Scores =====
export interface PronunciationScores {
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

// ===== Individual Result =====
export interface LipSoundIndividualResult {
  kitStageId: number;
  targetWord: string;
  recognizedText: string;
  pronunciation: PronunciationScores;
  evaluationScore: number;
  isSuccess: boolean;
  downloadFileKey?: string;
}

// ===== Overall Result =====
export interface LipSoundOverallResult {
  overallScore: number;
  overallFeedback: string;
}
