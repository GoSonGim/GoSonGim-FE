import type { User, AuthTokens } from '../models';

// ===== Login =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    tokens: AuthTokens;
    user: User;
  };
}

// ===== Google Login =====
export interface GoogleLoginRequest {
  code: string;
  redirectUri: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    tokens: AuthTokens;
    user: User;
  };
}

