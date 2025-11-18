import { apiClient } from '@/apis/client';
import type { ReplyRequest, ReplyResponse } from '@/types/situation';

/**
 * 사용자 답변 평가 및 다음 질문 생성
 */
export const replySession = async (data: ReplyRequest): Promise<ReplyResponse> => {
  const response = await apiClient.post<ReplyResponse>('/api/v1/situations/session/reply', data);
  return response.data;
};

