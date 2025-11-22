import { apiClient } from '@/apis/client';
import type { SituationDetailResponse } from '@/types/review';

export const getSituationDetail = async (recordingId: number): Promise<SituationDetailResponse> => {
  const response = await apiClient.get<SituationDetailResponse>(`/api/v1/review/situations/${recordingId}`);
  return response.data;
};
