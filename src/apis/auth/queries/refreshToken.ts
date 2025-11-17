import { apiClient } from '@/apis/client';
import type { RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth';

// 토큰 재발급
export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', data);
  return response.data;
};

