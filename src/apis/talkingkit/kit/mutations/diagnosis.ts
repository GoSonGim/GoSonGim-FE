import { apiClient } from '@/apis/client';
import type { KitDiagnosisResponse } from '@/types/talkingkit/kit';

// 조음 키트 진단 평가 (FormData)
export const diagnosisKit = async (formData: FormData): Promise<KitDiagnosisResponse> => {
  // FormData는 client.ts의 interceptor에서 자동으로 Content-Type을 처리함
  // 다른 API와 일관성을 위해 복수형 경로 사용: /api/v1/kits/diagnosis
  const response = await apiClient.post<KitDiagnosisResponse>('/api/v1/kits/diagnosis', formData);
  return response.data;
};

