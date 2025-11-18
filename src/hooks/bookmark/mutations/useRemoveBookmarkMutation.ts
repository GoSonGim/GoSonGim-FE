import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkAPI } from '@/apis/bookmark';

export const useRemoveBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: number) => bookmarkAPI.removeBookmark(bookmarkId),
    onSuccess: () => {
      // 모든 북마크 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

