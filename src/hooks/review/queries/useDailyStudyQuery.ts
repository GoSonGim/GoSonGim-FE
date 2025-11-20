import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useDailyStudyQuery = (date: string | null) => {
  return useQuery({
    queryKey: ['dailyStudy', date],
    queryFn: () => reviewAPI.getDailyStudy(date!),
    enabled: !!date,
  });
};
