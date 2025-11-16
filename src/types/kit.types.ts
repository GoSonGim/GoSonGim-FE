// ===== Kit Category =====
export interface KitCategory {
  categoryId: number;
  categoryName: string;
}

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

// ===== Kit =====
export interface Kit {
  kitId: number;
  kitName: string;
}

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
export interface KitStage {
  stageId: number;
  stageName: string;
}

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

// ===== Kit Stage Log =====
export interface KitStageLogRequest {
  kitStageId: number;
  evaluationScore: number;
  evaluationFeedback: string;
  isSuccess: boolean;
  fileKey: string;
}

export interface KitStageLogResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: Record<string, never>;
}

// ===== Kit Diagnosis =====
export interface DiagnosisScores {
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

export interface DiagnosisRecommendedKit {
  kitId: number;
  kitName: string;
}

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
