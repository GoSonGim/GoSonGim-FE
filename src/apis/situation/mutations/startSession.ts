import { apiClient } from '@/apis/client';
import type { StartSessionRequest, StartSessionResponse } from '@/types/situation';

/**
 * 상황극 세션 시작
 */
export const startSession = async (data: StartSessionRequest): Promise<StartSessionResponse> => {
  const response = await apiClient.post<StartSessionResponse>('/api/v1/situations/session/start', data);
  return response.data;
};

