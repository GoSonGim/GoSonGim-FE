import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkAPI } from '@/apis/bookmark';
import type { AddKitBookmarkRequest } from '@/types/bookmark';

export const useAddKitBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddKitBookmarkRequest) => bookmarkAPI.addKitBookmark(data),
    onSuccess: () => {
      // 모든 북마크 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};
