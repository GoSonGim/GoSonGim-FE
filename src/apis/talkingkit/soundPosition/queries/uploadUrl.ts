import { apiClient } from '@/apis/client';
import type { PresignedUploadResult } from '@/types/talkingkit/soundPosition';

/**
 * 업로드용 Presigned URL 발급
 * 백엔드가 POST + Query String 방식으로 파라미터를 받음
 * @param folder - "kit" (조음키트), "situation" (상황극), "test" (테스트)
 */
export const getUploadUrl = async (params: { folder: 'kit' | 'situation' | 'test'; fileName: string }) => {
  // POST 메서드로 Query String 전달
  const response = await apiClient.post<PresignedUploadResult>(
    '/api/v1/files/upload-url',
    {}, // empty body
    { params }, // Query String으로 전달
  );
  return response.data;
};
