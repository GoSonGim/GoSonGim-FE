import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useMonthlyStudyQuery = (month: string) => {
  return useQuery({
    queryKey: ['monthlyStudy', month],
    queryFn: () => reviewAPI.getMonthlyStudy(month),
  });
};
