import { apiClient } from '@/apis/client';
import type { RemoveBookmarkResponse } from '@/types/bookmark';

export const removeBookmark = async (bookmarkId: number): Promise<RemoveBookmarkResponse> => {
  const response = await apiClient.delete<RemoveBookmarkResponse>(`/api/v1/bookmark/${bookmarkId}`);
  return response.data;
};

