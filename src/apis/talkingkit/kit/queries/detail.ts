import { apiClient } from '@/apis/client';
import type { KitDetailResponse } from '@/types/talkingkit/kit';

// 키트 상세 정보 조회 (단계 목록 포함)
export const getKitDetail = async (kitId: number): Promise<KitDetailResponse> => {
  const response = await apiClient.get<KitDetailResponse>(`/api/v1/kits/${kitId}/stages`);
  return response.data;
};

