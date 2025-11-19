import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/auth/common/Input';
import { LoginButton } from '@/components/auth/loginForm/LoginButton';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import BackIcon from '@/assets/svgs/auth/login/back.svg';

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    emailError,
    emailErrorType,
    passwordError,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    isLoginEnabled,
  } = useLoginForm();

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
        <p className="text-body-14-regular text-gray-60">또박이 가입에 사용했던 이메일을 입력해주세요.</p>
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
            onChange={handleEmailChange}
            error={emailError}
            errorType={emailErrorType}
            placeholder="abcde@email.com"
          />

          {/* 비밀번호 Input */}
          <Input
            type="password"
            label="비밀번호"
            value={password}
            onChange={handlePasswordChange}
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
