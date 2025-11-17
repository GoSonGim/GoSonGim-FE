import { useQuery } from '@tanstack/react-query';
import { situationAPI } from '@/apis/situation.api';

export const useSituationDetail = (situationId: number) => {
  return useQuery({
    queryKey: ['situationDetail', situationId],
    queryFn: () => situationAPI.getSituationDetail(situationId),
    enabled: situationId > 0, // situationId가 유효할 때만 실행
  });
};
