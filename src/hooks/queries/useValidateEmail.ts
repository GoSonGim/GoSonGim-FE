import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/apis/auth.api';

export const useValidateEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['validateEmail', email],
    queryFn: () => authAPI.validateEmail(email),
    enabled: enabled && email.length > 0,
    staleTime: 0, // 항상 새로 검증
    gcTime: 0, // 캐시하지 않음
    retry: false, // 재시도 안 함
    refetchOnMount: 'always', // mount 시 항상 refetch
  });
};
