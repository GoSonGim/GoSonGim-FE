import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useRandomWordsQuery = () => {
  return useQuery({
    queryKey: ['reviewWords'],
    queryFn: reviewAPI.getRandomWords,
    staleTime: 0, // 항상 새로운 랜덤 데이터
    gcTime: 0, // 캐시하지 않음
    retry: false,
  });
};
