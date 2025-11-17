import { apiClient } from '@/apis/client';
import type { KitStageLogRequest, KitStageLogResponse } from '@/types/talkingkit/kit';

// 조음 키트 학습 기록 저장 (단어 외 학습)
export const saveKitStageLog = async (payload: KitStageLogRequest): Promise<KitStageLogResponse> => {
  const response = await apiClient.post<KitStageLogResponse>('/api/v1/kits/stages/log', payload);
  return response.data;
};

