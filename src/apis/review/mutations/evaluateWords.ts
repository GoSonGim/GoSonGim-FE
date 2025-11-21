import { apiClient } from '@/apis/client';
import type { WordEvaluationRequest, WordEvaluationResponse } from '@/types/review';

export const evaluateWords = async (payload: WordEvaluationRequest): Promise<WordEvaluationResponse> => {
  const response = await apiClient.post<WordEvaluationResponse>('/api/v1/kits/stages/evaluate', payload, {
    timeout: 30000,
  });
  return response.data;
};
