import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/useAuthStore';
import { getErrorMessage } from '@/utils/errorHandlerUtils';

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { refreshToken, logout } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('Refresh token이 없습니다.');
      }
      return authAPI.logout({ refreshToken });
    },
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error('로그아웃 실패:', errorMessage);
      // 실패해도 로컬 로그아웃 처리
      logout();
      navigate('/login');
    },
  });
};

