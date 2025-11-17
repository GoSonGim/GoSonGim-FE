import type { User, AuthTokens } from '../models';

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

