import { apiClient } from '@/apis/client';
import type { SituationListResponse, SituationDetailResponse } from '@/types/situation';

export const situationAPI = {
  // 상황극 목록 조회
  getSituations: async (category: string): Promise<SituationListResponse> => {
    const response = await apiClient.get<SituationListResponse>(`/api/v1/situations?category=${category}`);
    return response.data;
  },

  // 상황극 상세 조회
  getSituationDetail: async (situationId: number): Promise<SituationDetailResponse> => {
    const response = await apiClient.get<SituationDetailResponse>(`/api/v1/situations/${situationId}`);
    return response.data;
  },
};
