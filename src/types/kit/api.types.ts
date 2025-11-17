import type { KitCategory, Kit, KitStage, DiagnosisScores, DiagnosisRecommendedKit } from './models';

// ===== Kit Category =====
export interface KitCategoryResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    count: number;
    categories: KitCategory[];
  };
}

// ===== Kit List =====
export interface KitListResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    count: number;
    kits: Kit[];
  };
}

// ===== Kit Detail =====
export interface KitDetailResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    kitId: number;
    kitName: string;
    kitCategory: string;
    totalStages: number;
    stages: KitStage[];
  };
}

// ===== File Upload =====
export interface PresignedUploadResult {
  success: boolean;
  status: number;
  message: string;
  result: {
    fileKey: string;
    url: string;
    expiresIn: number;
  };
}

// ===== Kit Stage Log & Evaluation =====
export interface KitEvaluationRequest {
  kitStageId: number;
  evaluationScore: number;
  evaluationFeedback: string;
  isSuccess: boolean;
  fileKey: string;
}

export interface KitStageLogRequest extends KitEvaluationRequest {}

export interface KitStageLogResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: Record<string, never>;
}

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
