export interface KitEvaluationRequest {
  kitStageId: number;
  evaluationScore: number;
  evaluationFeedback: string;
  isSuccess: boolean;
  fileKey: string;
}
