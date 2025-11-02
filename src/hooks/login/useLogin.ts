import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // 이메일로 로그인
  const handleEmailLogin = () => {
    navigate('/login/email');
  };

  // 구글로 로그인
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // await loginWithGoogle();
      // Navigate to home after successful login
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  // 문의하기
  const handleInquiry = () => {
    // TODO: Navigate to inquiry page or open contact
    console.log('Inquiry clicked');
  };

  // 회원가입 바텀시트 열기
  const handleSignup = () => {
    setIsSignupOpen(true);
  };

  // 구글로 회원가입
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      // TODO: 구글 OAuth 회원가입 로직
      console.log('Google signup clicked');
      setIsSignupOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Google signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일로 회원가입
  const handleEmailSignup = () => {
    console.log('Email signup clicked');
    setIsSignupOpen(false);
    navigate('/signup/email');
  };

  return {
    isLoading,
    isSignupOpen,
    setIsSignupOpen,
    handleEmailLogin,
    handleGoogleLogin,
    handleInquiry,
    handleSignup,
    handleGoogleSignup,
    handleEmailSignup,
  };
};
