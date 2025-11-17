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

