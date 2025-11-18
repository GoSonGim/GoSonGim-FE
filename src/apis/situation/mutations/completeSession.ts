import { apiClient } from '@/apis/client';
import type { CompleteSessionRequest, CompleteSessionResponse } from '@/types/situation';

/**
 * 상황극 세션 종료
 */
export const completeSession = async (data: CompleteSessionRequest): Promise<CompleteSessionResponse> => {
  const response = await apiClient.post<CompleteSessionResponse>('/api/v1/situations/session/complete', data);
  return response.data;
};

