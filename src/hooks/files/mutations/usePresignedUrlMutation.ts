import { useMutation } from '@tanstack/react-query';
import { filesAPI } from '@/apis/files';
import type { PresignedUrlRequest, PresignedUrlResponse } from '@/types/files';

/**
 * Presigned URL 발급 Mutation
 */
export const usePresignedUrlMutation = () => {
  return useMutation<PresignedUrlResponse, Error, PresignedUrlRequest>({
    mutationFn: filesAPI.getPresignedUrl,
  });
};

