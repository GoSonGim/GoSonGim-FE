// Presigned URL 정보
export interface PresignedUrlInfo {
  fileKey: string;
  url: string;
  expiresIn: number;
}

// 다운로드 URL 정보
export interface DownloadUrlInfo {
  fileKey: string;
  url: string;
  expiresIn: number;
}
