import type { DownloadUrlInfo } from '../models';

// 다운로드 URL 발급 요청 (query parameter)
export interface DownloadUrlRequest {
  fileKey: string;
}

// 다운로드 URL 발급 응답
export interface DownloadUrlResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: DownloadUrlInfo;
}

