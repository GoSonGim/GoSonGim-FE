import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/Login/input/Input';
import { LoginButton } from '@/components/Login/button/LoginButton';
import { isValidEmail } from '@/utils/login/validation';
import BackIcon from '@/assets/svgs/login/loginForm/back.svg';

// Mock 데이터
const MOCK_EMAIL = 'test@example.com';
const MOCK_PASSWORD = '123456';

const LoginForm = () => {
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
        <div className="text-heading-01-semibold text-[24px] font-bold text-gray-100">이메일로 로그인하기</div>
        <p className="text-body-14-regular text-gray-60">아끼미 가입에 사용했던 이메일을 입력해주세요.</p>
      </div>

      {/* Input 폼 */}
      <div className="absolute top-[230px] left-4 flex w-[361px] flex-col gap-14">
        {/* Inputs */}
        <div className="flex flex-col gap-6">
          {/* 이메일 Input */}
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
          />

          {/* 비밀번호 Input */}
          <Input
            type="password"
            label="비밀번호"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setPasswordError(null); // 입력 중에는 에러 제거
            }}
            error={passwordError}
            placeholder="6자리를 입력하세요"
          />
        </div>

        {/* 로그인 버튼 */}
        <LoginButton onClick={handleLogin} disabled={!isLoginEnabled}>
          로그인
        </LoginButton>
      </div>
    </div>
  );
};

export default LoginForm;
