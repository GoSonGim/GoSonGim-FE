import { apiClient } from '@/apis/client';
import type { KitDetailResponse } from '@/types/review';

export const getKitDetail = async (kitId: number): Promise<KitDetailResponse> => {
  const response = await apiClient.get<KitDetailResponse>(`/api/v1/review/kits/${kitId}`);
  return response.data;
};
