import { useQuery } from '@tanstack/react-query';
import { bookmarkAPI } from '@/apis/bookmark';

export const useBookmarkPreview = (limit = 10) => {
  return useQuery({
    queryKey: ['bookmarks', 'preview', limit],
    queryFn: () => bookmarkAPI.getBookmarkPreview(limit),
  });
};

