import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(270deg, #4C5EFF 0%, #2E3899 100%)',
      }}
    >
      {/* Lottie 애니메이션 */}
      <div className="flex items-center justify-center">
        <DotLottieReact src="/landingPageLogo.lottie" loop autoplay speed={0.7} className="h-[300px] w-[300px]" />
      </div>
    </div>
  );
};

export default LandingPage;
