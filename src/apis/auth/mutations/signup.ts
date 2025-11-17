import { apiClient } from '@/apis/client';
import type { SignupRequest, SignupResponse } from '@/types/auth';

// 이메일 회원가입
export const emailSignup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await apiClient.post<SignupResponse>('/api/v1/auth/email/signup', data);
  return response.data;
};

