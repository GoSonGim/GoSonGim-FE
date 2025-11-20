import { apiClient } from '@/apis/client';
import type { SituationListResponse, SituationListParams } from '@/types/review';

export const getSituationList = async (params: SituationListParams): Promise<SituationListResponse> => {
  const response = await apiClient.get<SituationListResponse>('/api/v1/review/situations', { params });
  return response.data;
};
