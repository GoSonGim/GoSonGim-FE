import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '@/apis/profile';
import { useAuthStore } from '@/stores/useAuthStore';
import { logger } from '@/utils/common/loggerUtils';

export const useDeleteAccountMutation = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => profileAPI.deleteAccount(),
    onSuccess: (response) => {
      logger.log('✅ Account deleted:', response.result);
      logger.log(`계정 삭제 예정: ${response.result.purgeAt}`);

      // 1. Zustand persist 정리
      logout();

      // 2. localStorage 수동 정리
      localStorage.removeItem('auth-storage');

      // 3. 강제 페이지 새로고침
      window.location.href = '/login';
    },
    onError: (error) => {
      logger.error('❌ Account deletion failed:', error);
    },
  });
};
