import { apiClient } from '@/apis/client';
import type { SituationListResponse } from '@/types/search/situation';

// 상황극 목록 조회
export const getSituations = async (category: string): Promise<SituationListResponse> => {
  const response = await apiClient.get<SituationListResponse>(`/api/v1/situations?category=${category}`);
  return response.data;
};

