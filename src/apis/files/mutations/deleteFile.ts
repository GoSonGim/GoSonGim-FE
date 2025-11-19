import { apiClient } from '@/apis/client';
import type { DeleteFileRequest, DeleteFileResponse } from '@/types/files';

/**
 * S3에서 파일 삭제
 */
export const deleteFile = async (params: DeleteFileRequest): Promise<DeleteFileResponse> => {
  const response = await apiClient.delete<DeleteFileResponse>(`/api/v1/files`, {
    params: {
      fileKey: params.fileKey,
    },
  });
  return response.data;
};

