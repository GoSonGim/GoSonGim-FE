import { apiClient } from '@/apis/client';
import type { KitListResponse } from '@/types/talkingkit/kit';

// 카테고리별 조음 키트 목록 조회
export const getKitsByCategory = async (categoryId: number): Promise<KitListResponse> => {
  const response = await apiClient.get<KitListResponse>(`/api/v1/kits/category/${categoryId}`);
  return response.data;
};

