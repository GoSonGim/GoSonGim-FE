import { useMutation } from '@tanstack/react-query';
import { situationAPI } from '@/apis/situation';
import type { ReplyRequest, ReplyResponse } from '@/types/situation';

/**
 * 답변 평가 및 다음 질문 생성 Mutation
 */
export const useReplyMutation = () => {
  return useMutation<ReplyResponse, Error, ReplyRequest>({
    mutationFn: situationAPI.replySession,
  });
};
