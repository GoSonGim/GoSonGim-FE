import { apiClient } from '@/apis/client';
import type { PresignedUrlRequest, PresignedUrlResponse } from '@/types/files';

/**
 * S3 업로드를 위한 Presigned URL 발급
 */
export const getPresignedUrl = async (params: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
  const response = await apiClient.post<PresignedUrlResponse>(
    `/api/v1/files/upload-url`,
    null,
    {
      params: {
        folder: params.folder,
        fileName: params.fileName,
      },
    }
  );
  return response.data;
};

