import { Button } from '@/components/login/button/Button';
import { SignupBottomSheet } from '@/components/login/signUp/SignupBottomSheet';
import { useLogin } from '@/hooks/login/useLogin';

import EmailIcon from '@/assets/svgs/login/emailIcon.svg';
import Divider from '@/assets/svgs/login/divider.svg';
import Logo from '@/assets/svgs/login/logo.svg';
import GoogleLogo from '@/assets/svgs/login/googleLogo.svg';

const Login = () => {
  const {
    isLoading,
    isSignupOpen,
    setIsSignupOpen,
    handleEmailLogin,
    handleGoogleLogin,
    handleInquiry,
    handleSignup,
    handleGoogleSignup,
    handleEmailSignup,
  } = useLogin();

  return (
    <div className="relative h-screen w-full bg-white">
      {/* Logo */}
      <div className="absolute top-[182px] left-1/2 -translate-x-1/2">
        <Logo className="h-[107px] w-[90px]" />
      </div>

      {/* Login Buttons Container */}
      <div className="absolute top-[540px] left-[37px] flex w-[328px] flex-col gap-24">
        {/* Buttons */}
        <div className="flex w-full flex-col gap-4">
          {/* Email Login Button */}
          <Button variant="secondary" icon={<EmailIcon className="h-5 w-5" />} onClick={handleEmailLogin}>
            이메일로 로그인
          </Button>

          {/* Google Login Button - Following Google's Branding Guidelines */}
          <Button
            variant="google"
            icon={<GoogleLogo className="h-5 w-5" />}
            onClick={handleGoogleLogin}
            loading={isLoading}
          >
            구글로 로그인
          </Button>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleInquiry}
            className="text-detail-02 text-gray-80 cursor-pointer transition-colors hover:text-gray-100"
          >
            문의하기
          </button>
          <div>
            <Divider className="text-gray-80 h-[13.5px] w-0.5" />
          </div>
          <button
            onClick={handleSignup}
            className="text-detail-02 text-gray-80 cursor-pointer transition-colors hover:text-gray-100"
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 회원가입 바텀시트 */}
      <SignupBottomSheet
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onGoogleSignup={handleGoogleSignup}
        onEmailSignup={handleEmailSignup}
      />
    </div>
  );
};

export default Login;
