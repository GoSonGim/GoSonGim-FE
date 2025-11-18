import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { situationAPI } from '@/apis/search/situation';

const CATEGORIES = ['DAILY', 'PURCHASE', 'MEDICAL', 'TRAFFIC', 'JOB', 'SOCIAL', 'EMERGENCY'];

interface SituationWithCategory {
  situationId: number;
  situationName: string;
  categoryEnum: string;
}

export const useRandomSituations = () => {
  const queries = useQueries({
    queries: CATEGORIES.map((category) => ({
      queryKey: ['situations', category],
      queryFn: () => situationAPI.getSituations(category),
      staleTime: 5 * 60 * 1000, // 5분
    })),
  });

  const randomSituations = useMemo(() => {
    // 모든 쿼리가 성공했는지 확인
    const allSuccess = queries.every((q) => q.isSuccess);
    if (!allSuccess) return [];

    // 모든 상황극을 하나의 배열로 합치기
    const allSituations: SituationWithCategory[] = queries.flatMap((query, index) => {
      const category = CATEGORIES[index];
      return (
        query.data?.result.situations.map((s) => ({
          ...s,
          categoryEnum: category, // 영문 카테고리 추가
        })) || []
      );
    });

    // 랜덤으로 3개 선택
    const shuffled = [...allSituations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [queries]);

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;

  return { randomSituations, isLoading, error };
};
