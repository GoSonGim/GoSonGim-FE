import { apiClient } from '@/apis/client';
import type { KitListResponse, KitListParams } from '@/types/review';

export const getKitList = async (params: KitListParams): Promise<KitListResponse> => {
  const response = await apiClient.get<KitListResponse>('/api/v1/review/kits', { params });
  return response.data;
};

