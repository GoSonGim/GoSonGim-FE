import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isValidEmail } from '@/utils/auth/validationUtils';
import { useSignupMutation } from '@/hooks/auth/mutations/useSignupMutation';
import { useValidateEmail } from '@/hooks/auth/queries/useValidateEmail';
import { getErrorMessage, parseApiError } from '@/utils/common/errorHandlerUtils';
import { useDebounce } from '@/hooks/common/useDebounce';

export const useSignupForm = () => {
  const queryClient = useQueryClient();
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

  // Mutations & Queries
  const signupMutation = useSignupMutation();

  // 이메일 debounce 처리 (1000ms)
  const debouncedEmail = useDebounce(email, 1000);

  // 이메일 중복 확인 쿼리 (이메일이 유효한 형식일 때만 실행)
  const shouldCheckEmail = debouncedEmail.length > 0 && isValidEmail(debouncedEmail);
  const {
    data: emailValidation,
    isLoading: isCheckingEmail,
    isError: isEmailCheckError,
  } = useValidateEmail(debouncedEmail, shouldCheckEmail);

  // email이 변경되면 검증 상태 초기화 (debounce 전)
  useEffect(() => {
    if (email !== debouncedEmail) {
      // 아직 debounce 대기 중이므로 검증 상태 초기화
      setIsEmailValidated(false);
      // 이전 이메일 검증 쿼리 캐시 제거
      queryClient.removeQueries({ queryKey: ['validateEmail'] });
    }
  }, [email, debouncedEmail, queryClient]);

  // 이메일 검증 결과에 따른 처리
  useEffect(() => {
    if (!debouncedEmail || !isValidEmail(debouncedEmail)) {
      setIsEmailValidated(false);
      return;
    }

    if (isCheckingEmail) {
      return;
    }

    if (isEmailCheckError) {
      setEmailError('이메일 확인 중 오류가 발생했습니다');
      setEmailErrorType('user');
      setIsEmailValidated(false);
      return;
    }

    if (emailValidation) {
      if (emailValidation.result.available) {
        // 사용 가능한 이메일
        setEmailError(null);
        setIsEmailValidated(true);
        if (currentStep === 0) {
          setCurrentStep(1);
        }
      } else {
        // 이미 사용 중인 이메일
        setEmailError('이미 가입된 이메일입니다');
        setEmailErrorType('user');
        setIsEmailValidated(false);
      }
    }
  }, [debouncedEmail, emailValidation, isCheckingEmail, isEmailCheckError, currentStep]);

  // 이메일 실시간 형식 검증
  const validateEmailFormat = (value: string) => {
    if (!value) {
      setEmailError(null);
      setIsEmailValidated(false);
      return;
    }

    // 이메일 형식 검증
    if (!isValidEmail(value)) {
      setEmailError('올바르지 않은 이메일 형식입니다.');
      setEmailErrorType('form');
      setIsEmailValidated(false);
      return;
    }

    // 형식이 유효하면 에러 초기화 (새로운 검증을 위해)
    setEmailError(null);
  };

  // 비밀번호 실시간 검증
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError(null);
      setIsPasswordValidated(false);
      return;
    }

    // 8자 이상 20자 이하 검증
    if (value.length < 8 || value.length > 20) {
      setPasswordError('비밀번호는 8자 이상 20자 이하여야 합니다.');
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
    // 이메일이 변경되면 이전 검증 상태 초기화
    setIsEmailValidated(false);
    validateEmailFormat(value);
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
    // 최종 검증
    if (!isValidEmail(email)) {
      setEmailError('올바르지 않은 이메일 형식입니다.');
      setEmailErrorType('form');
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setPasswordError('비밀번호는 8자 이상 20자 이하여야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다');
      return;
    }

    // API 호출
    signupMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          const parsedError = parseApiError(error);

          // 409: 이메일 중복
          if (parsedError.status === 409) {
            setEmailError('이미 등록된 이메일입니다');
            setEmailErrorType('user');
            setCurrentStep(0);
          }
          // 400: 유효성 검사 실패
          else if (parsedError.status === 400) {
            setPasswordError(getErrorMessage(error));
          }
          // 기타 에러
          else {
            setPasswordError(getErrorMessage(error));
          }
        },
      },
    );
  };

  // 회원가입 버튼 활성화 조건
  const isSignupEnabled =
    isEmailValidated &&
    isPasswordValidated &&
    passwordConfirm.length > 0 &&
    !emailError &&
    !passwordError &&
    !passwordConfirmError;

  // 실제 로딩 상태: API 호출 중이거나 debounce 대기 중
  const isEmailLoading = isCheckingEmail || (email !== debouncedEmail && email.length > 0 && isValidEmail(email));

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
    isCheckingEmail: isEmailLoading,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSignup,
    isSignupEnabled,
  };
};
