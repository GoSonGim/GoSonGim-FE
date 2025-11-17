import { useQuery } from '@tanstack/react-query';
import { kitAPI } from '@/apis/talkingkit';

export const useKitDetail = (kitId: number) => {
  return useQuery({
    queryKey: ['kitDetail', kitId],
    queryFn: () => kitAPI.getKitDetail(kitId),
    enabled: kitId > 0, // kitId가 유효할 때만 실행
  });
};
