import { apiClient } from '@/apis/client';
import type { BookmarkPreviewResponse } from '@/types/bookmark';

export const getBookmarkPreview = async (limit = 10): Promise<BookmarkPreviewResponse> => {
  const response = await apiClient.get<BookmarkPreviewResponse>('/api/v1/bookmark/preview', {
    params: { limit },
  });
  return response.data;
};

