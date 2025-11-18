import { useMutation } from '@tanstack/react-query';
import { situationAPI } from '@/apis/situation';
import type { CompleteSessionRequest, CompleteSessionResponse } from '@/types/situation';

/**
 * 상황극 세션 종료 Mutation
 */
export const useCompleteSessionMutation = () => {
  return useMutation<CompleteSessionResponse, Error, CompleteSessionRequest>({
    mutationFn: situationAPI.completeSession,
  });
};
