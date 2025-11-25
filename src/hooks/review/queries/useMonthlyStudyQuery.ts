import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

/**
 * 월별 학습 기록 조회 (학습한 날짜 목록)
 * 학습 완료 후 즉시 반영을 위해 mount 시 항상 refetch
 */
export const useMonthlyStudyQuery = (month: string) => {
  return useQuery({
    queryKey: ['monthlyStudy', month],
    queryFn: () => reviewAPI.getMonthlyStudy(month),
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 0,
  });
};
