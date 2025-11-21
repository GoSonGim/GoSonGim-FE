import { apiClient } from '@/apis/client';
import type { DailyStudyResponse } from '@/types/review';

export const getDailyStudy = async (date: string): Promise<DailyStudyResponse> => {
  const response = await apiClient.get<DailyStudyResponse>('/api/v1/review/daily', {
    params: { date },
  });
  return response.data;
};
