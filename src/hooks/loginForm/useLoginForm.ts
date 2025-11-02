import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '@/utils/login/validation';

// Mock 데이터
const MOCK_EMAIL = 'test@example.com';
const MOCK_PASSWORD = '123456';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailErrorType, setEmailErrorType] = useState<'form' | 'user'>('user');
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
  };

  // 로그인 처리
  const handleLogin = () => {
    // 1. 가입된 이메일인지 검증 (Mock) - 로그인 버튼 클릭 시에만
    if (email !== MOCK_EMAIL) {
      setEmailError('가입되어있지 않은 이메일입니다');
      setEmailErrorType('user');
      return;
    }

    // 2. 비밀번호 검증 (Mock)
    if (password !== MOCK_PASSWORD) {
      setPasswordError('비밀번호가 올바르지 않습니다');
      return;
    }

    // 로그인 성공
    console.log('Login successful');
    navigate('/');
  };

  // 로그인 버튼 활성화 조건
  const isLoginEnabled = email.length > 0 && password.length > 0 && !emailError;

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
  };
};
