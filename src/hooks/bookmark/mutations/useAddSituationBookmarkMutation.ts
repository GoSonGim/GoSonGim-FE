import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkAPI } from '@/apis/bookmark';
import type { AddSituationBookmarkRequest } from '@/types/bookmark';

export const useAddSituationBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSituationBookmarkRequest) => bookmarkAPI.addSituationBookmark(data),
    onSuccess: () => {
      // 모든 북마크 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

