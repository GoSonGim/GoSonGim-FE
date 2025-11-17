import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/auth/Input';
import { LoginButton } from '@/components/auth/LoginButton';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import BackIcon from '@/assets/svgs/auth/login/back.svg';

const SignupForm = () => {
  const navigate = useNavigate();
  const {
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
    isCheckingEmail,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSignup,
    isSignupEnabled,
  } = useSignupForm();

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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Input
            type="email"
            label="이메일"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            errorType={emailErrorType}
            placeholder="abcde@email.com"
            showCheckIcon={isEmailValidated}
            isLoading={isCheckingEmail}
          />
        </motion.div>

        {/* 비밀번호 Input (step >= 1일 때 표시) */}
        {currentStep >= 1 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Input
              type="password"
              label="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              placeholder="8자 이상 20자 이하 입력하세요"
              showCheckIcon={isPasswordValidated}
            />
          </motion.div>
        )}

        {/* 비밀번호 확인 Input (step >= 2일 때 표시) */}
        {currentStep >= 2 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Input
              type="password"
              label="비밀번호 확인"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
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
