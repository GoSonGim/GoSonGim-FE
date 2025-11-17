// ===== Presigned Upload =====
export interface PresignedUploadResponse {
  fileKey: string;
  url: string;
  expiresIn: number;
}

export interface PresignedUploadResult {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: PresignedUploadResponse;
}

