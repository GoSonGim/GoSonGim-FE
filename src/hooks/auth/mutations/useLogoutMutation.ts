import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { logger } from '@/utils/common/loggerUtils';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      logger.log('🔑 Attempting logout with refreshToken:', refreshToken ? 'exists' : 'null');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      return authAPI.logout({ refreshToken });
    },
    onSuccess: (response) => {
      logger.log('✅ Logout success:', response.result);

      // 1. Zustand persist 정리 (자동)
      useAuthStore.getState().logout();

      // 2. localStorage 수동 정리 (이중 보장)
      localStorage.removeItem('auth-storage');

      // 3. 강제 페이지 새로고침으로 완전한 초기화
      window.location.href = '/login';
    },
    onError: (error) => {
      logger.error('❌ Logout failed:', error);

      // 에러 발생해도 동일한 정리 프로세스
      useAuthStore.getState().logout();
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    },
  });
};
