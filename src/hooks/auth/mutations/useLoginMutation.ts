import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { getErrorMessage } from '@/utils/common/errorHandlerUtils';
import { logger } from '@/utils/common/loggerUtils';
import type { LoginRequest } from '@/types/auth';

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.emailLogin(data),
    onSuccess: (response) => {
      const { user, tokens } = response.result;

      // 1. Zustand persist에 저장 (자동으로 localStorage에 쓰기)
      login(user, tokens.accessToken, tokens.refreshToken);

      // 2. 강제 페이지 새로고침으로 완전한 앱 재시작
      window.location.href = '/';
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      logger.error('로그인 실패:', errorMessage);
      // 에러는 컴포넌트에서 처리
    },
  });
};
