import { useQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';

export const useKitLogDetailQuery = (recordingId: number) => {
  return useQuery({
    queryKey: ['kitLogDetail', recordingId],
    queryFn: () => reviewAPI.getKitLogDetail(recordingId),
    enabled: recordingId > 0,
    staleTime: 0, // Presigned URL 캐싱 방지
    gcTime: 0, // 메모리에도 보관 안 함
    refetchOnMount: 'always', // mount 시 항상 새로 fetch
  });
};

