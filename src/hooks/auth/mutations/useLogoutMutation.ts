import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export const useLogoutMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      console.log('🔑 Attempting logout with refreshToken:', refreshToken ? 'exists' : 'null');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      return authAPI.logout({ refreshToken });
    },
    onSuccess: (response) => {
      console.log('✅ Logout success:', response.result);

      // 로컬 스토어 정리
      useAuthStore.getState().logout();

      // 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('❌ Logout failed:', error);

      // 에러가 발생해도 로컬 로그아웃은 수행
      useAuthStore.getState().logout();
      navigate('/login', { replace: true });
    },
  });
};
