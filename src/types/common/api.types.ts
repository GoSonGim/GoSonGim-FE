// ===== Error Response =====
export interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  timestamp: string;
  error: {
    code: string;
  };
}
