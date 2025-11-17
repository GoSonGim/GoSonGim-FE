import type { KitStage } from '../models';

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

