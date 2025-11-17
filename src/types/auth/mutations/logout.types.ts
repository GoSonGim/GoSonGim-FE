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

