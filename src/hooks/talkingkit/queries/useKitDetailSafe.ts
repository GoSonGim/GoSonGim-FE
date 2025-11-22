import { useKitDetail } from './useKitDetail';

interface UseKitDetailSafeReturn {
  kitDetail: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
  getStage: (stageId: number) => {
    stageId: number;
    stageName: string;
    stageDescription: string;
  } | null;
}

/**
 * useKitDetail의 안전한 버전
 * - 로딩 상태 명시적 반환
 * - stages가 undefined일 때 안전하게 처리
 * - getStage 헬퍼 함수 제공
 */
export const useKitDetailSafe = (kitId: number): UseKitDetailSafeReturn => {
  const { data: kitDetail, isLoading, isError, error } = useKitDetail(kitId);

  const getStage = (stageId: number) => {
    if (!kitDetail?.result?.stages) {
      return null;
    }
    return kitDetail.result.stages.find((stage: any) => stage.stageId === stageId) || null;
  };

  return {
    kitDetail,
    isLoading,
    isError,
    error,
    getStage,
  };
};
