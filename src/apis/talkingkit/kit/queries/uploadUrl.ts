import { apiClient } from '@/apis/client';
import type { PresignedUploadResult } from '@/types/talkingkit/kit';

// 파일 업로드용 Presigned URL 요청
export const getUploadUrl = async (params: {
  folder: 'kit' | 'situation' | 'test';
  fileName: string;
}): Promise<PresignedUploadResult> => {
  const response = await apiClient.post<PresignedUploadResult>(
    `/api/v1/files/upload-url?folder=${params.folder}&fileName=${params.fileName}`,
  );
  return response.data;
};

