import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

/**
 * 특정 날짜의 일별 학습 기록 조회
 * 학습 완료 후 즉시 반영을 위해 mount 시 항상 refetch
 */
export const useDailyStudyQuery = (date: string | null) => {
  return useQuery({
    queryKey: ['dailyStudy', date],
    queryFn: () => reviewAPI.getDailyStudy(date!),
    enabled: !!date,
    refetchOnMount: 'always',
  });
};
