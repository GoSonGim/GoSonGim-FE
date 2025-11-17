import { apiClient } from '@/apis/client';
import type { SituationDetailResponse } from '@/types/search/situation';

// 상황극 상세 조회
export const getSituationDetail = async (situationId: number): Promise<SituationDetailResponse> => {
  const response = await apiClient.get<SituationDetailResponse>(`/api/v1/situations/${situationId}`);
  return response.data;
};

