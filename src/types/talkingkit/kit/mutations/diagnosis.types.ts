import type { DiagnosisScores, DiagnosisRecommendedKit } from '../models';

// ===== Kit Diagnosis =====
export interface KitDiagnosisResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    recognizedText: string;
    scores: DiagnosisScores;
    overallScore: number;
    recommendedKits: DiagnosisRecommendedKit[];
  };
}

