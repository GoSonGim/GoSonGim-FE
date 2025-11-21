import { useState, lazy, Suspense, useRef } from 'react';
import type { TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeftIcon from '@/assets/svgs/profile/profilehome/review-leftarrow.svg';
import ProfileInfo1 from '@/assets/svgs/profile/profileinfo/profile-info1.svg';
import ProfileInfo2 from '@/assets/svgs/profile/profileinfo/profile-info2.svg';
import ProfileInfo3 from '@/assets/svgs/profile/profileinfo/profile-info3.svg';
import ProfileInfo4 from '@/assets/svgs/profile/profileinfo/profile-info4.svg';
import ProfileInfo5 from '@/assets/svgs/profile/profileinfo/profile-info5.svg';
import ProfileInfo6 from '@/assets/svgs/profile/profileinfo/profile-info6.svg';
import ProfileInfo7 from '@/assets/svgs/profile/profileinfo/profile-info7.svg';
import ProfileInfo8 from '@/assets/svgs/profile/profileinfo/profile-info8.svg';
import ProfileLeft from '@/assets/svgs/profile/profileinfo/profile-left.svg';
import ProfileRight from '@/assets/svgs/profile/profileinfo/profile-right.svg';

// Lazy load the large SVG
const ProfileGood = lazy(() => import('@/assets/svgs/profile/profileinfo/profile-good.svg'));

const ProfileGuide = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleNext = () => {
    if (currentPage < 8) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              나에게 맞춰진 발음연습,
              <br />
              또박과 함께해요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo1 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              홈에서는 내 학습, 상황극 추천, 그리고
              <br />
              추가 컨텐츠를 진행할 수 있어요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo2 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
              {/* 파란색 테두리 3개 */}
              <div className="pointer-events-none absolute top-[32px] left-[-15px] h-[147px] w-[279px] rounded-[16px] border-[3px] border-[#78aaff] blur-[1px]" />
              <div className="pointer-events-none absolute top-[186px] left-[-15px] h-[147px] w-[279px] rounded-[16px] border-[3px] border-[#78aaff] blur-[1px]" />
              <div className="pointer-events-none absolute top-[346px] left-[-15px] h-[162px] w-[279px] rounded-[16px] border-[3px] border-[#78aaff] blur-[1px]" />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              내 학습에서는 저장한 <span className="text-[#4157ff]">조음•발음 키트</span>와
              <br />
              <span className="text-[#4157ff]">상황극 연습</span>을 확인할 수 있어요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo3 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
              {/* 파란색 테두리 2개 */}
              <div className="pointer-events-none absolute top-[83px] left-[-15px] h-[37px] w-[279px] rounded-[16px] border-[3px] border-[#78aaff] blur-[1px]" />
              <div className="pointer-events-none absolute top-[126px] left-[-15px] h-[388px] w-[279px] rounded-[16px] border-[3px] border-[#78aaff] blur-[1px]" />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              학습 탐색에서 <span className="text-[#4157ff]">학습을 저장</span>하거나
              <br />
              <span className="text-[#4157ff]">발화 교정</span>을 진행해요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo4 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
              {/* 파란색 동그라미 - 학습 탐색 */}
              <div className="pointer-events-none absolute top-[455px] left-[65px] h-[58px] w-[58px] rounded-full border-[3px] border-[#78aaff] blur-[1px]" />
            </div>
          </>
        );

      case 4:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              조음•발음 키트에서는 발음과 연계
              <br />된 <span className="text-[#4157ff]">근육 훈련</span>과{' '}
              <span className="text-[#4157ff]">단어 훈련</span>을 진행해요
            </p>
            <div className="relative overflow-hidden rounded-[16px]">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo5 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <p className="mb-6 text-center text-[16px] leading-[1.2] font-medium tracking-tight text-gray-100">
              상황극 연습에서 <span className="text-[#4157ff]">가상대화</span>를 하고{' '}
              <span className="whitespace-nowrap">아바타의</span>
              <br />
              입모양을 보고 <span className="text-[#4157ff]">원하는 문장</span>을 학습해요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo6 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              이전에 학습한 내용을 다시 <span className="text-[#4157ff]">복습</span>하거나
              <br />
              최근 내 녹음을 <span className="text-[#4157ff]">다시 들을</span> 수 있어요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo7 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
              {/* 파란색 동그라미 - 식당에서 음식 주문하기 */}
              <div className="pointer-events-none absolute top-[195px] left-[189px] h-[58px] w-[58px] rounded-full border-[3px] border-[#78aaff] blur-[1px]" />
            </div>
          </>
        );

      case 7:
        return (
          <>
            <p className="mb-6 text-center text-[17px] leading-normal font-medium text-gray-100">
              프로필 화면에서 나의 <span className="text-[#4157ff]">학습 성장 정</span>
              <span className="text-[#4157ff]">도</span>와<br /> <span className="text-[#4157ff]">기록</span>을 확인해요
            </p>
            <div className="relative">
              <div className="h-[540px] w-[249px] rounded-[16px] border-4 border-solid border-black" />
              <div className="absolute top-[4px] left-[4px]">
                <ProfileInfo8 className="h-[532px] w-[241px] rounded-[16px]" />
              </div>
              {/* 파란색 테두리 2개 - 이름/레벨 박스와 그래프 박스 */}
              <div className="pointer-events-none absolute top-[86px] left-[-23px] h-[134px] w-[292px] rounded-[16px] border-[3px] border-[#78aaff] blur-[1px]" />
              <div className="border-blue-2 pointer-events-none absolute top-[228px] left-[-23px] h-[134px] w-[292px] rounded-[16px] border-[3px] blur-[1px]" />
            </div>
          </>
        );

      case 8:
        return (
          <>
            <p className="mb-4 text-center text-[17px] leading-normal font-medium text-gray-100">
              또박에 대한 안내는 여기까지 입니다.
            </p>
            <p className="mb-8 text-center text-[17px] leading-normal font-medium text-gray-100">
              또박에서 맞춤형 발음 학습을 진행하고
              <br />
              어제보다 나은 발음을 만들어봐요!
            </p>
            <div className="flex justify-center">
              <Suspense fallback={<div className="h-[151px] w-[143px]"></div>}>
                <motion.div
                  initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 15,
                    mass: 0.8,
                  }}
                >
                  <ProfileGood className="h-[151px] w-[143px]" />
                </motion.div>
              </Suspense>
            </div>
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => navigate('/profile')}
                className="flex h-[49px] cursor-pointer items-center justify-center rounded-[16px] bg-[#d9d9d9] px-10"
              >
                <p className="text-[17px] leading-normal font-medium text-black">이용안내 나가기</p>
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex h-16 items-center justify-center bg-white px-4">
        <button onClick={() => navigate('/profile')} className="absolute left-4 cursor-pointer p-2">
          <LeftIcon className="h-[18px] w-[10px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">이용안내</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main
        className="flex flex-1 flex-col items-center overflow-y-auto px-4 pt-8 pb-24"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 인디케이터 */}
        <div className="mb-6 flex justify-center gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className={`h-3 w-3 rounded-full ${index === currentPage ? 'bg-black' : 'bg-gray-40'}`} />
          ))}
        </div>

        {/* 페이지 컨텐츠 (화살표와 함께) */}
        <div className="flex items-center justify-center gap-4">
          {/* 왼쪽 화살표 */}
          <button onClick={handlePrev} className={`shrink-0 p-2 ${currentPage > 0 ? 'cursor-pointer' : 'invisible'}`}>
            <ProfileLeft className="h-[30px] w-[15px]" />
          </button>

          {/* 페이지 내용 */}
          <div className="flex flex-col items-center">{renderPage()}</div>

          {/* 오른쪽 화살표 */}
          <button onClick={handleNext} className={`shrink-0 p-2 ${currentPage < 8 ? 'cursor-pointer' : 'invisible'}`}>
            <ProfileRight className="h-[30px] w-[15px]" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileGuide;
