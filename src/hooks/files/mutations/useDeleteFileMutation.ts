import { useMutation } from '@tanstack/react-query';
import { filesAPI } from '@/apis/files';
import type { DeleteFileRequest, DeleteFileResponse } from '@/types/files';

/**
 * 파일 삭제 Mutation
 */
export const useDeleteFileMutation = () => {
  return useMutation<DeleteFileResponse, Error, DeleteFileRequest>({
    mutationFn: filesAPI.deleteFile,
  });
};

