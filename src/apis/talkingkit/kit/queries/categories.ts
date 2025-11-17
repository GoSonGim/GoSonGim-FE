import { apiClient } from '@/apis/client';
import type { KitCategoryResponse } from '@/types/talkingkit/kit';

// 조음 키트 카테고리 목록 조회
export const getCategories = async (): Promise<KitCategoryResponse> => {
  const response = await apiClient.get<KitCategoryResponse>('/api/v1/kits/category');
  return response.data;
};

