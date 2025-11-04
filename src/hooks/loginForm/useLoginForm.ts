import { useState } from 'react';
import { isValidEmail } from '@/utils/login/validationUtils';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { getErrorMessage, parseApiError } from '@/utils/errorHandlerUtils';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailErrorType, setEmailErrorType] = useState<'form' | 'user'>('user');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();

  // 이메일 실시간 형식 검증 (형식만 체크)
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(null);
      return;
    }

    // 이메일 형식 검증만 실시간으로
    if (!isValidEmail(value)) {
      setEmailError('올바르지 않은 이메일 형식입니다.');
      setEmailErrorType('form');
      return;
    }

    setEmailError(null);
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
    // 에러 초기화
    setEmailError(null);
    setPasswordError(null);
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
  };

  // 로그인 처리
  const handleLogin = () => {
    // 형식 검증
    if (!isValidEmail(email)) {
      setEmailError('올바르지 않은 이메일 형식입니다.');
      setEmailErrorType('form');
      return;
    }

    if (password.length < 6) {
      setPasswordError('비밀번호는 6자리 이상이어야 합니다');
      return;
    }

    // API 호출
    loginMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          const parsedError = parseApiError(error);

          // 401: 이메일 또는 비밀번호 오류
          if (parsedError.status === 401) {
            setEmailError('이메일 또는 비밀번호가 올바르지 않습니다.');
            setEmailErrorType('user');
          }
          // 410: 탈퇴한 계정
          else if (parsedError.status === 410) {
            setEmailError('탈퇴한 계정입니다');
            setEmailErrorType('user');
          }
          // 기타 에러
          else {
            setPasswordError(getErrorMessage(error));
          }
        },
      },
    );
  };

  // 로그인 버튼 활성화 조건
  const isLoginEnabled =
    email.length > 0 && password.length > 0 && !emailError && !loginMutation.isPending;

  return {
    email,
    password,
    emailError,
    emailErrorType,
    passwordError,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    isLoginEnabled,
    isLoading: loginMutation.isPending,
  };
};
