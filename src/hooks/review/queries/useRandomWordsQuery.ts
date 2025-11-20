import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useRandomWordsQuery = () => {
  return useQuery({
    queryKey: ['reviewWords'],
    queryFn: reviewAPI.getRandomWords,
    retry: false,
  });
};
