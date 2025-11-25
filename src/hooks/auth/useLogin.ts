import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/common/loggerUtils';

// 구글 OAuth 설정
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // 구글 OAuth에서 돌아왔을 때 로딩 상태 리셋
  useEffect(() => {
    if (sessionStorage.getItem('googleAuthAttempt') === 'true') {
      sessionStorage.removeItem('googleAuthAttempt');
      setIsLoading(false);
    }
  }, []);

  // 구글 OAuth URL 생성
  const getGoogleAuthUrl = (isSignup: boolean = false) => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      state: isSignup ? 'signup' : 'login', // 로그인/회원가입 구분
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  };

  // 이메일로 로그인
  const handleEmailLogin = () => {
    navigate('/login/email');
  };

  // 구글로 로그인
  const handleGoogleLogin = () => {
    setIsLoading(true);
    sessionStorage.setItem('googleAuthAttempt', 'true');
    // 구글 OAuth 페이지로 리다이렉트
    window.location.href = getGoogleAuthUrl(false);
  };

  // 문의하기
  const handleInquiry = () => {
    // TODO: Navigate to inquiry page or open contact
    logger.log('Inquiry clicked');
  };

  // 회원가입 바텀시트 열기
  const handleSignup = () => {
    setIsSignupOpen(true);
  };

  // 구글로 회원가입
  const handleGoogleSignup = () => {
    setIsLoading(true);
    setIsSignupOpen(false);
    sessionStorage.setItem('googleAuthAttempt', 'true');
    // 구글 OAuth 페이지로 리다이렉트 (state=signup)
    window.location.href = getGoogleAuthUrl(true);
  };

  // 이메일로 회원가입
  const handleEmailSignup = () => {
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
