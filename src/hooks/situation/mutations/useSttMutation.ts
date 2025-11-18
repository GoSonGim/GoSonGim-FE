import { useMutation } from '@tanstack/react-query';
import { situationAPI } from '@/apis/situation';
import type { SttResponse } from '@/types/situation';

/**
 * 음성을 텍스트로 변환 (STT) Mutation
 */
export const useSttMutation = () => {
  return useMutation<SttResponse, Error, File>({
    mutationFn: situationAPI.convertSpeechToText,
  });
};

