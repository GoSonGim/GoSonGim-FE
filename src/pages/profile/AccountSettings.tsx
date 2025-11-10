import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftIcon from '@/assets/svgs/profile/profilehome/review-leftarrow.svg';
import AccountConfirmModal from '@/components/profile/AccountConfirmModal';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleLogout = () => {
    // TODO: 실제 로그아웃 API 연동
    console.log('로그아웃 처리');
    setIsLogoutModalOpen(false);
    // 로그아웃 후 로그인 페이지로 이동
    // navigate('/login');
  };

  const handleWithdraw = () => {
    // TODO: 실제 계정 탈퇴 API 연동
    console.log('계정 탈퇴 처리');
    setIsWithdrawModalOpen(false);
    // 탈퇴 후 로그인 페이지로 이동
    // navigate('/login');
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-[#F2F6FA]">
      {/* 상단바 */}
      <div className="flex h-[64px] items-center overflow-hidden bg-white">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-[8px] left-[16px] flex h-[48px] w-[48px] cursor-pointer items-center justify-center overflow-hidden p-[8px]"
        >
          <LeftIcon className="h-[18px] w-[10px]" />
        </button>

        {/* 타이틀 */}
        <div className="absolute top-[35px] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="text-center text-[20px] leading-normal font-normal whitespace-pre text-gray-100">계정 설정</p>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="mt-[8px] flex w-full flex-col items-center bg-white">
        {/* 로그아웃 */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="h-[64px] w-full cursor-pointer overflow-hidden bg-white"
        >
          <p className="px-[16px] py-[18px] text-left text-[18px] leading-normal font-normal whitespace-pre text-black">
            로그아웃
          </p>
        </button>

        {/* 구분선 */}
        <div className="h-px w-full bg-[#E2E4E7]" />

        {/* 계정 탈퇴 */}
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="h-[64px] w-full cursor-pointer overflow-hidden bg-white"
        >
          <p className="px-[16px] py-[18px] text-left text-[18px] leading-normal font-normal whitespace-pre text-black">
            계정 탈퇴
          </p>
        </button>
      </div>
      <div className="h-px w-full bg-[#E2E4E7]" />

      {/* 계정 탈퇴 아래 흰색 배경 영역 */}
      <div className="flex-1 bg-white" />

      {/* 로그아웃 확인 모달 */}
      <AccountConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        type="logout"
        onConfirm={handleLogout}
      />

      {/* 계정 탈퇴 확인 모달 */}
      <AccountConfirmModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        type="withdraw"
        onConfirm={handleWithdraw}
      />
    </div>
  );
};

export default AccountSettings;
