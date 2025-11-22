import type { ApiResponse } from '@/types/common/api.types';

export interface KitDetailRequest {
  kitId: number;
}

export interface KitDetailResult {
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

export type KitDetailResponse = ApiResponse<KitDetailResult>;
