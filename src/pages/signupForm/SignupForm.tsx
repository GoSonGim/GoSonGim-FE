import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/Login/input/Input';
import { LoginButton } from '@/components/Login/button/LoginButton';
import { isValidEmail } from '@/utils/login/validation';
import BackIcon from '@/assets/svgs/login/singIn/back.svg';

// Mock 데이터
const MOCK_EMAIL = 'test@example.com'; // 이미 가입된 이메일

const SignupForm = () => {
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

  return (
    <div className="relative h-screen w-full bg-white">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-[60px] left-4 flex cursor-pointer items-center justify-center"
      >
        <BackIcon className="h-5 w-5" />
      </button>

      {/* 타이틀 및 서브타이틀 */}
      <div className="absolute top-[128px] left-4 flex flex-col gap-2">
        <div className="text-heading-01-semibold text-[24px] font-bold text-gray-100">이메일로 가입하기</div>
        <p className="text-body-14-regular text-gray-60">아끼미 가입에 사용할 이메일을 입력해주세요.</p>
      </div>

      {/* Input 폼 */}
      <div className="absolute top-[230px] left-4 flex w-[361px] flex-col gap-6">
        {/* 이메일 Input (항상 표시) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            type="email"
            label="이메일"
            value={email}
            onChange={(value) => {
              setEmail(value);
              validateEmail(value); // 실시간 검증
            }}
            error={emailError}
            errorType={emailErrorType}
            placeholder="abcde@email.com"
            showCheckIcon={isEmailValidated}
          />
        </motion.div>

        {/* 비밀번호 Input (step >= 1일 때 표시) */}
        {currentStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              type="password"
              label="비밀번호"
              value={password}
              onChange={(value) => {
                setPassword(value);
                validatePassword(value); // 실시간 검증
              }}
              error={passwordError}
              placeholder="6자리 이상 입력하세요"
              showCheckIcon={isPasswordValidated}
            />
          </motion.div>
        )}

        {/* 비밀번호 확인 Input (step >= 2일 때 표시) */}
        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              type="password"
              label="비밀번호 확인"
              value={passwordConfirm}
              onChange={(value) => {
                setPasswordConfirm(value);
                validatePasswordConfirm(value); // 실시간 검증
              }}
              error={passwordConfirmError}
              placeholder="비밀번호를 다시 입력하세요"
              showCheckIcon={passwordConfirm.length > 0 && passwordConfirm === password && !passwordConfirmError}
            />
          </motion.div>
        )}

        {/* 회원가입 버튼 (step >= 2일 때 표시) */}
        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8"
          >
            <LoginButton onClick={handleSignup} disabled={!isSignupEnabled}>
              회원가입
            </LoginButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
