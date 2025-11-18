import { apiClient } from '@/apis/client';
import type { AddSituationBookmarkRequest, AddSituationBookmarkResponse } from '@/types/bookmark';

export const addSituationBookmark = async (
  data: AddSituationBookmarkRequest,
): Promise<AddSituationBookmarkResponse> => {
  const response = await apiClient.post<AddSituationBookmarkResponse>('/api/v1/bookmark/situation', data);
  return response.data;
};

