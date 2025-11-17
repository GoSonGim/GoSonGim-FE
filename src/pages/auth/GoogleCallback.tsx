import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/useAuthStore';
import { getErrorMessage } from '@/utils/common/errorHandlerUtils';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했으면 종료
    if (hasProcessed.current) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state'); // 'login' or 'signup'
    const error = searchParams.get('error');

    // 사용자가 취소한 경우
    if (error === 'access_denied') {
      alert('구글 로그인이 취소되었습니다.');
      navigate('/login');
      return;
    }

    if (code) {
      hasProcessed.current = true; // 처리 완료 표시

      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/callback`;

      console.log('Google OAuth - Sending to backend:', { code, redirectUri }); // 디버깅용

      authAPI
        .googleLogin({
          code,
          redirectUri,
        })
        .then((response) => {
          const { user, tokens } = response.result;
          login(user, tokens.accessToken, tokens.refreshToken);

          // state가 'signup'이면 닉네임 페이지로
          if (state === 'signup') {
            navigate('/signup/nickname');
          } else {
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('Google login failed:', error);
          console.error('Error response:', error.response?.data); // 백엔드 에러 상세
          const errorMessage = getErrorMessage(error);
          alert(`구글 로그인에 실패했습니다: ${errorMessage}`);
          navigate('/login');
        });
    } else {
      // code가 없는 경우
      alert('인증 코드가 없습니다.');
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="border-gray-20 border-t-blue-1 h-12 w-12 animate-spin rounded-full border-4"></div>
        <p className="text-body-01-regular text-gray-60">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
