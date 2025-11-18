import { useQuery } from '@tanstack/react-query';
import { bookmarkAPI } from '@/apis/bookmark';
import type { BookmarkListParams } from '@/types/bookmark';

export const useBookmarkList = (params: BookmarkListParams) => {
  return useQuery({
    queryKey: ['bookmarks', params.type, params.category, params.sort],
    queryFn: () => bookmarkAPI.getBookmarkList(params),
  });
};

