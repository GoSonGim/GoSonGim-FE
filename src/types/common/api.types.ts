// ===== Generic API Response =====
export interface ApiResponse<T> {
  success: boolean;
  result: T;
}

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
