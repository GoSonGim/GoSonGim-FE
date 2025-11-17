import { apiClient } from '@/apis/client';
import type {
  KitCategoryResponse,
  KitListResponse,
  KitDetailResponse,
  PresignedUploadResult,
  KitStageLogRequest,
  KitStageLogResponse,
  KitDiagnosisResponse,
} from '@/types/kit';

export const kitAPI = {
  // 조음 키트 카테고리 목록 조회
  getCategories: async (): Promise<KitCategoryResponse> => {
    const response = await apiClient.get<KitCategoryResponse>('/api/v1/kits/category');
    return response.data;
  },

  // 카테고리별 조음 키트 목록 조회
  getKitsByCategory: async (categoryId: number): Promise<KitListResponse> => {
    const response = await apiClient.get<KitListResponse>(`/api/v1/kits/category/${categoryId}`);
    return response.data;
  },

  // 키트 상세 정보 조회 (단계 목록 포함)
  getKitDetail: async (kitId: number): Promise<KitDetailResponse> => {
    const response = await apiClient.get<KitDetailResponse>(`/api/v1/kits/${kitId}/stages`);
    return response.data;
  },

  // 파일 업로드용 Presigned URL 요청
  getUploadUrl: async (params: { folder: 'kit' | 'situation' | 'test'; fileName: string }): Promise<PresignedUploadResult> => {
    const response = await apiClient.post<PresignedUploadResult>(
      `/api/v1/files/upload-url?folder=${params.folder}&fileName=${params.fileName}`
    );
    return response.data;
  },

  // 조음 키트 학습 기록 저장 (단어 외 학습)
  saveKitStageLog: async (payload: KitStageLogRequest): Promise<KitStageLogResponse> => {
    const response = await apiClient.post<KitStageLogResponse>('/api/v1/kits/stages/log', payload);
    return response.data;
  },

  // 조음 키트 진단 평가 (FormData)
  diagnosisKit: async (formData: FormData): Promise<KitDiagnosisResponse> => {
    // FormData는 client.ts의 interceptor에서 자동으로 Content-Type을 처리함
    // 다른 API와 일관성을 위해 복수형 경로 사용: /api/v1/kits/diagnosis
    const response = await apiClient.post<KitDiagnosisResponse>('/api/v1/kits/diagnosis', formData);
    return response.data;
  },
};
