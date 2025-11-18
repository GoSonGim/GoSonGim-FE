import { apiClient } from '@/apis/client';
import type { SttResponse } from '@/types/situation';

/**
 * 음성 파일을 텍스트로 변환 (STT)
 */
export const convertSpeechToText = async (audioFile: File): Promise<SttResponse> => {
  const formData = new FormData();
  formData.append('audioFile', audioFile);

  const response = await apiClient.post<SttResponse>('/api/v1/situations/stt', formData);
  return response.data;
};

