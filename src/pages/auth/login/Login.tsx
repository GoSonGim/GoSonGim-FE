import { Button } from '@/components/auth/common/Button';
import { SignupBottomSheet } from '@/components/auth/login/SignupBottomSheet';
import { useLogin } from '@/hooks/auth/useLogin';

import EmailIcon from '@/assets/svgs/auth/login/emailIcon.svg';
import Divider from '@/assets/svgs/auth/login/divider.svg';
import Logo from '@/assets/svgs/auth/login/ttobaki-logo.svg';
import GoogleLogo from '@/assets/svgs/auth/login/googleLogo.svg';

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
    <div className="relative flex h-full w-full flex-col items-center bg-[#EAEEFF]">
      {/* Logo - Center */}
      <div className="flex flex-1 items-center justify-center pt-16">
        <Logo className="h-[98px] w-[175px]" />
      </div>

      {/* Login Buttons Container - Bottom */}
      <div className="flex w-[328px] flex-col gap-12 pb-12">
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
