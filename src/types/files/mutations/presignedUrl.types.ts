import type { PresignedUrlInfo } from '../models';

// Presigned URL 발급 요청 (query parameters)
export interface PresignedUrlRequest {
  folder: string; // "kit" | "situation" | "test"
  fileName: string;
}

// Presigned URL 발급 응답
export interface PresignedUrlResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: PresignedUrlInfo;
}

