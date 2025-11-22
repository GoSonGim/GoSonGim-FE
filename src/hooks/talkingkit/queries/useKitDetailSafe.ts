import { useKitDetail } from './useKitDetail';
import type { KitStage, KitDetailResponse } from '@/types/talkingkit/kit';

interface UseKitDetailSafeReturn {
  kitDetail: KitDetailResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  getStage: (stageId: number) => KitStage | null;
}

/**
 * useKitDetail의 안전한 버전
 * - 로딩 상태 명시적 반환
 * - stages가 undefined일 때 안전하게 처리
 * - getStage 헬퍼 함수 제공
 */
export const useKitDetailSafe = (kitId: number): UseKitDetailSafeReturn => {
  const { data: kitDetail, isLoading, isError, error } = useKitDetail(kitId);

  const getStage = (stageId: number): KitStage | null => {
    if (!kitDetail?.result?.stages) {
      return null;
    }
    return kitDetail.result.stages.find((stage: KitStage) => stage.stageId === stageId) || null;
  };

  return {
    kitDetail,
    isLoading,
    isError,
    error,
    getStage,
  };
};
