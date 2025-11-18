import { useMutation } from '@tanstack/react-query';
import { situationAPI } from '@/apis/situation';
import type { StartSessionRequest, StartSessionResponse } from '@/types/situation';

/**
 * 상황극 세션 시작 Mutation
 */
export const useStartSessionMutation = () => {
  return useMutation<StartSessionResponse, Error, StartSessionRequest>({
    mutationFn: situationAPI.startSession,
  });
};

