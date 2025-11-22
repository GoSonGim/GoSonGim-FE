export interface KitDetailRequest {
  kitId: number;
}

export interface KitDetailResponse {
  kitId: number;
  kitName: string;
  records: Array<{
    id: number;
    kitStageId: number;
    kitStageName: string;
    evaluationScore: number;
    evaluationFeedback: string;
    isSuccess: boolean;
    targetWord: string;
    audioFileUrl: string;
    createdAt: string;
  }>;
}
