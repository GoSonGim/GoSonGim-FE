import { apiClient } from '@/apis/client';
import type { ValidateEmailResponse } from '@/types/auth';

// 이메일 중복 확인
export const validateEmail = async (email: string): Promise<ValidateEmailResponse> => {
  const response = await apiClient.get<ValidateEmailResponse>('/api/v1/auth/email/validate', {
    params: { email },
  });
  return response.data;
};

