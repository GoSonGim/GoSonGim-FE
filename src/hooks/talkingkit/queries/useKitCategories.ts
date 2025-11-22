import { useQuery } from '@tanstack/react-query';
import { kitAPI } from '@/apis/talkingkit';

export const useKitCategories = () => {
  return useQuery({
    queryKey: ['kitCategories'],
    queryFn: () => kitAPI.getCategories(),
    staleTime: 1000 * 60 * 60, // 1시간 (정적 데이터)
    gcTime: 1000 * 60 * 60 * 24, // 24시간
  });
};
