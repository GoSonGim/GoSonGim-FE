// ===== File Upload =====
export interface PresignedUploadResult {
  success: boolean;
  status: number;
  message: string;
  result: {
    fileKey: string;
    url: string;
    expiresIn: number;
  };
}

