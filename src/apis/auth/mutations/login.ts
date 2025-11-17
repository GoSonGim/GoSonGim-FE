import { apiClient } from '@/apis/client';
import type {
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
} from '@/types/auth';

// 이메일 로그인
export const emailLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/v1/auth/email/login', data);
  return response.data;
};

// 구글 로그인
export const googleLogin = async (data: GoogleLoginRequest): Promise<GoogleLoginResponse> => {
  const response = await apiClient.post<GoogleLoginResponse>('/api/v1/auth/google/login', data);
  return response.data;
};

