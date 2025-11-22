import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useSituationDetailQuery = (recordingId: number) => {
  return useQuery({
    queryKey: ['situationDetail', recordingId],
    queryFn: () => reviewAPI.getSituationDetail(recordingId),
    enabled: recordingId > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
