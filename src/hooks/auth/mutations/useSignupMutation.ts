import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/useAuthStore';
import { getErrorMessage } from '@/utils/common/errorHandlerUtils';
import type { SignupRequest } from '@/types/auth.types';

export const useSignupMutation = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: SignupRequest) => authAPI.emailSignup(data),
    onSuccess: (response) => {
      const { user, tokens } = response.result;
      login(user, tokens.accessToken, tokens.refreshToken);
      navigate('/signup/nickname');
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error('회원가입 실패:', errorMessage);
      // 에러는 컴포넌트에서 처리
    },
  });
};

