import { apiClient } from '@/apis/client';
import type { BookmarkListParams, BookmarkListResponse } from '@/types/bookmark';

export const getBookmarkList = async (params: BookmarkListParams): Promise<BookmarkListResponse> => {
  const response = await apiClient.get<BookmarkListResponse>('/api/v1/bookmark', { params });
  return response.data;
};
