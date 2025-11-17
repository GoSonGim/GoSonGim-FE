import type { AuthTokens } from '../models';

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

