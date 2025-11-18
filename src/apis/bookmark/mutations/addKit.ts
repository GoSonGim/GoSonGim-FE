import { apiClient } from '@/apis/client';
import type { AddKitBookmarkRequest, AddKitBookmarkResponse } from '@/types/bookmark';

export const addKitBookmark = async (data: AddKitBookmarkRequest): Promise<AddKitBookmarkResponse> => {
  const response = await apiClient.post<AddKitBookmarkResponse>('/api/v1/bookmark/kit', data);
  return response.data;
};

