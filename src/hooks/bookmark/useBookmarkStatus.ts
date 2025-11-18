import { useBookmarkList } from './queries/useBookmarkList';
import type { BookmarkType, BookmarkItem } from '@/types/bookmark';

/**
 * 특정 키트 또는 상황극의 북마크 상태를 확인하는 훅
 */
export const useBookmarkStatus = (type: BookmarkType) => {
  const { data } = useBookmarkList({
    type,
    sort: 'latest',
  });

  const bookmarks = data?.result.data || [];

  const getBookmarkStatus = (id: number) => {
    const bookmark = bookmarks.find((b: BookmarkItem) => b.kitId === id);
    return {
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?.bookmarkId,
    };
  };

  return { getBookmarkStatus, bookmarks };
};

