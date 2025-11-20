import { apiClient } from '@/apis/client';
import type { RandomWordsResponse } from '@/types/review';

export const getRandomWords = async (): Promise<RandomWordsResponse> => {
  const response = await apiClient.get<RandomWordsResponse>('/api/v1/review/words');
  return response.data;
};
