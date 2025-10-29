import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import HomeActive from '@/assets/svgs/bottomNav/homeActive.svg';
import HomeDefault from '@/assets/svgs/bottomNav/homeDefault.svg';
import SearchIcon from '@/assets/svgs/bottomNav/searchIcon.svg';
import ReviewIcon from '@/assets/svgs/bottomNav/reviewIcon.svg';
import ProfileIcon from '@/assets/svgs/bottomNav/profileIcon.svg';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="absolute right-0 bottom-0 left-0 flex items-end justify-center gap-8 border-t border-[#dde2e7] bg-white px-0 pt-1 pb-10">
      <button
        onClick={() => navigate('/')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1"
      >
        <div className="h-6 w-6" style={{ color: isActive('/') ? '#3C434F' : '#8A94A0' }}>
          {isActive('/') ? <HomeActive /> : <HomeDefault />}
        </div>
        <span
          className={clsx('text-base leading-[1.5] font-semibold', {
            'text-[#3C434F]': isActive('/'),
            'text-[#8A94A0]': !isActive('/'),
          })}
        >
          홈
        </span>
      </button>

      <button
        onClick={() => navigate('/search')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1"
      >
        <div className="h-6 w-6" style={{ color: isActive('/search') ? '#3C434F' : '#8A94A0' }}>
          <SearchIcon />
        </div>
        <span
          className={clsx('text-base leading-[1.5] font-semibold', {
            'text-[#3C434F]': isActive('/search'),
            'text-[#8A94A0]': !isActive('/search'),
          })}
        >
          학습탐색
        </span>
      </button>

      <button
        onClick={() => navigate('/review')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1"
      >
        <div className="h-6 w-6" style={{ color: isActive('/review') ? '#3C434F' : '#8A94A0' }}>
          <ReviewIcon />
        </div>
        <span
          className={clsx('text-base leading-[1.5] font-semibold', {
            'text-[#3C434F]': isActive('/review'),
            'text-[#8A94A0]': !isActive('/review'),
          })}
        >
          복습
        </span>
      </button>

      <button
        onClick={() => navigate('/profile')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1"
      >
        <div className="h-6 w-6" style={{ color: isActive('/profile') ? '#3C434F' : '#8A94A0' }}>
          <ProfileIcon />
        </div>
        <span
          className={clsx('text-base leading-[1.5] font-semibold', {
            'text-[#3C434F]': isActive('/profile'),
            'text-[#8A94A0]': !isActive('/profile'),
          })}
        >
          프로필
        </span>
      </button>
    </nav>
  );
};

export default BottomNav;
