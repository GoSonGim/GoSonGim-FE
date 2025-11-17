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

