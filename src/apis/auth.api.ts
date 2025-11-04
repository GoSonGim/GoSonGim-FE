import { apiClient } from '@/apis/client';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  ValidateEmailResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
} from '@/types/auth.types';

export const authAPI = {
  // 이메일 로그인
  emailLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/email/login', data);
    return response.data;
  },

  // 이메일 회원가입
  emailSignup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/api/v1/auth/email/signup', data);
    return response.data;
  },

  // 이메일 중복 확인
  validateEmail: async (email: string): Promise<ValidateEmailResponse> => {
    const response = await apiClient.get<ValidateEmailResponse>('/api/v1/auth/email/validate', {
      params: { email },
    });
    return response.data;
  },

  // 구글 로그인
  googleLogin: async (data: GoogleLoginRequest): Promise<GoogleLoginResponse> => {
    const response = await apiClient.post<GoogleLoginResponse>('/api/v1/auth/google/login', data);
    return response.data;
  },

  // 토큰 재발급
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', data);
    return response.data;
  },

  // 로그아웃
  logout: async (data: LogoutRequest): Promise<LogoutResponse> => {
    const response = await apiClient.delete<LogoutResponse>('/api/v1/auth/refresh', {
      data,
    });
    return response.data;
  },
};
