import type { User, AuthTokens } from './models';

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

// ===== Signup =====
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
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

// ===== Email Validation =====
export interface ValidateEmailResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    email: string;
    available: boolean;
  };
}

// ===== Token Refresh =====
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    tokens: AuthTokens;
  };
}

// ===== Logout =====
export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    success: boolean;
    message: string;
  };
}
