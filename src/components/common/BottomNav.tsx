import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import HomeActive from '@/assets/svgs/common/bottomNav/homeActive.svg';
import HomeDefault from '@/assets/svgs/common/bottomNav/homeDefault.svg';
import SearchIcon from '@/assets/svgs/common/bottomNav/searchIcon.svg';
import ReviewIcon from '@/assets/svgs/common/bottomNav/reviewIcon.svg';
import ProfileIcon from '@/assets/svgs/common/bottomNav/profileIcon.svg';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="absolute bottom-0 flex w-full items-end justify-center gap-8 border-t border-[#dde2e7] bg-white px-0 pt-1 pb-10">
      <button
        onClick={() => navigate('/home')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-[4px]"
      >
        <div
          className={clsx('h-6 w-6', {
            'text-gray-80': isActive('/home'),
            'text-gray-50': !isActive('/home'),
          })}
        >
          {isActive('/home') ? <HomeActive className="h-6 w-6" /> : <HomeDefault className="h-6 w-6" />}
        </div>
        <span
          className={clsx('text-body-02-semibold', {
            'text-gray-80': isActive('/home'),
            'text-gray-50': !isActive('/home'),
          })}
        >
          홈
        </span>
      </button>

      <button
        onClick={() => navigate('/search')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-[4px]"
      >
        <div
          className={clsx('h-6 w-6', {
            'text-gray-80': isActive('/search'),
            'text-gray-50': !isActive('/search'),
          })}
        >
          <SearchIcon className="h-6 w-6" />
        </div>
        <span
          className={clsx('text-body-02-semibold', {
            'text-gray-80': isActive('/search'),
            'text-gray-50': !isActive('/search'),
          })}
        >
          학습탐색
        </span>
      </button>

      <button
        onClick={() => navigate('/review')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-[4px]"
      >
        <div
          className={clsx('h-6 w-6', {
            'text-gray-80': isActive('/review'),
            'text-gray-50': !isActive('/review'),
          })}
        >
          <ReviewIcon className="h-6 w-6" />
        </div>
        <span
          className={clsx('text-body-02-semibold', {
            'text-gray-80': isActive('/review'),
            'text-gray-50': !isActive('/review'),
          })}
        >
          복습
        </span>
      </button>

      <button
        onClick={() => navigate('/profile')}
        className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-[4px]"
      >
        <div
          className={clsx('h-6 w-6', {
            'text-gray-80': isActive('/profile'),
            'text-gray-50': !isActive('/profile'),
          })}
        >
          <ProfileIcon className="h-6 w-6" />
        </div>
        <span
          className={clsx('text-body-02-semibold', {
            'text-gray-80': isActive('/profile'),
            'text-gray-50': !isActive('/profile'),
          })}
        >
          프로필
        </span>
      </button>
    </nav>
  );
};

export default BottomNav;
