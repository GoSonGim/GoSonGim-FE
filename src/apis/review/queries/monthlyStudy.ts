import { apiClient } from '@/apis/client';
import type { MonthlyStudyResponse } from '@/types/review';

export const getMonthlyStudy = async (month: string): Promise<MonthlyStudyResponse> => {
  const response = await apiClient.get<MonthlyStudyResponse>('/api/v1/review/monthly', {
    params: { month },
  });
  return response.data;
};
