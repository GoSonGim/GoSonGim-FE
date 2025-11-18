import { apiClient } from '@/apis/client';
import type { DownloadUrlRequest, DownloadUrlResponse } from '@/types/files';

/**
 * S3 파일 다운로드를 위한 Presigned URL 발급
 */
export const getDownloadUrl = async (params: DownloadUrlRequest): Promise<DownloadUrlResponse> => {
  const response = await apiClient.get<DownloadUrlResponse>(`/api/v1/files/download-url`, {
    params: {
      fileKey: params.fileKey,
    },
  });
  return response.data;
};

