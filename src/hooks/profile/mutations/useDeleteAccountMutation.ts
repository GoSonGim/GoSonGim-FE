import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '@/apis/profile';
import { useAuthStore } from '@/stores/useAuthStore';

export const useDeleteAccountMutation = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => profileAPI.deleteAccount(),
    onSuccess: (response) => {
      console.log('✅ Account deleted:', response.result);
      console.log(`계정 삭제 예정: ${response.result.purgeAt}`);

      // 로그아웃 처리 (토큰 및 사용자 정보 삭제)
      logout();

      // 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('❌ Account deletion failed:', error);
    },
  });
};
