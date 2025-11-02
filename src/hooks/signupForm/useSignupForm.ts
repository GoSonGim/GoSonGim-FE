import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '@/utils/login/validation';

// Mock 데이터
const MOCK_EMAIL = 'test@example.com'; // 이미 가입된 이메일

export const useSignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: email, 1: password, 2: password confirm

  // 각 input 값
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 에러 상태
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailErrorType, setEmailErrorType] = useState<'form' | 'user'>('user');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);

  // 각 단계 완료 여부
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);

  // 이메일 실시간 검증
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(null);
      setIsEmailValidated(false);
      return;
    }

    // 1. 이메일 형식 검증
    if (!isValidEmail(value)) {
      setEmailError('올바르지 않은 이메일 형식입니다.');
      setEmailErrorType('form');
      setIsEmailValidated(false);
      return;
    }

    // 2. 이미 가입된 이메일인지 검증 (Mock)
    if (value === MOCK_EMAIL) {
      setEmailError('이미 가입된 이메일입니다');
      setEmailErrorType('user');
      setIsEmailValidated(false);
      return;
    }

    // 검증 통과 - 자동으로 다음 스텝으로
    setEmailError(null);
    setIsEmailValidated(true);
    setCurrentStep(1);
  };

  // 비밀번호 실시간 검증
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError(null);
      setIsPasswordValidated(false);
      return;
    }

    // 6자리 이상 검증
    if (value.length < 6) {
      setPasswordError('비밀번호는 6자리 이상이어야 합니다');
      setIsPasswordValidated(false);
      return;
    }

    // 검증 통과 - 자동으로 다음 스텝으로
    setPasswordError(null);
    setIsPasswordValidated(true);
    setCurrentStep(2);
  };

  // 비밀번호 확인 실시간 검증
  const validatePasswordConfirm = (value: string) => {
    if (!value) {
      setPasswordConfirmError(null);
      return;
    }

    // 비밀번호와 일치하는지 검증
    if (value !== password) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다');
      return;
    }

    // 검증 통과
    setPasswordConfirmError(null);
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  // 비밀번호 확인 변경 핸들러
  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    validatePasswordConfirm(value);
  };

  // 회원가입 처리
  const handleSignup = () => {
    // 모든 검증이 완료되었을 때만 실행
    console.log('Signup successful', { email, password });
    navigate('/');
  };

  // 회원가입 버튼 활성화 조건
  const isSignupEnabled =
    isEmailValidated &&
    isPasswordValidated &&
    passwordConfirm.length > 0 &&
    !emailError &&
    !passwordError &&
    !passwordConfirmError;

  return {
    currentStep,
    email,
    password,
    passwordConfirm,
    emailError,
    emailErrorType,
    passwordError,
    passwordConfirmError,
    isEmailValidated,
    isPasswordValidated,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSignup,
    isSignupEnabled,
  };
};
