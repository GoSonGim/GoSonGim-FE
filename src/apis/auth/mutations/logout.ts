import { apiClient } from '@/apis/client';
import type { LogoutRequest, LogoutResponse } from '@/types/auth';

// 로그아웃
export const logout = async (data: LogoutRequest): Promise<LogoutResponse> => {
  const response = await apiClient.delete<LogoutResponse>('/api/v1/auth/refresh', {
    data,
  });
  return response.data;
};

