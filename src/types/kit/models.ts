// ===== Kit Category =====
export interface KitCategory {
  categoryId: number;
  categoryName: string;
}

// ===== Kit =====
export interface Kit {
  kitId: number;
  kitName: string;
}

// ===== Kit Stage =====
export interface KitStage {
  stageId: number;
  stageName: string;
}

// ===== Diagnosis =====
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
