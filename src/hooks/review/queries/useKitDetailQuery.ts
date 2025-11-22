import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useKitDetailQuery = (kitId: number) => {
  return useQuery({
    queryKey: ['kitDetail', kitId],
    queryFn: () => reviewAPI.getKitDetail(kitId),
    enabled: kitId > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
