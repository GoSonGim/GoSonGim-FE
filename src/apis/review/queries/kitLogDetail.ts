import { apiClient } from '@/apis/client';
import type { KitLogDetailResponse } from '@/types/review';

export const getKitLogDetail = async (recordingId: number): Promise<KitLogDetailResponse> => {
  const response = await apiClient.get<KitLogDetailResponse>(`/api/v1/review/kits/logs/${recordingId}`);
  return response.data;
};

