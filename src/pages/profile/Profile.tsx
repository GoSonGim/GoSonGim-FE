import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import useEmblaCarousel from 'embla-carousel-react';
import { profileMockData } from '@/mock/profile/profile.mock';
import ProfileEdit from '@/assets/svgs/profile/profilehome/profile-edit.svg';
import ProfileRightArrow from '@/assets/svgs/profile/profilehome/profile-rightarrow.svg';
import ProfileArrow from '@/assets/svgs/profile/profilehome/profile-arrow.svg';
import GraphCard from '@/components/profile/GraphCard';
import NicknameChangeModal from '@/components/profile/NicknameChangeModal';

const Profile = () => {
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });
  const [levelHover, setLevelHover] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const { userName, level, stats, wordSuccessData, conversationSuccessData, totalSuccessCount } = profileMockData;
  const [currentUserName, setCurrentUserName] = useState(userName);

  const handleNicknameChange = (newNickname: string) => {
    setCurrentUserName(newNickname);
    setIsNicknameModalOpen(false);
  };

  return (
    <div className="bg-background-primary relative flex h-full w-full flex-col overflow-y-auto pb-24">
      {/* 상단 헤더 */}
      <div className="flex h-16 items-center bg-white px-4 py-2">
        <h1 className="px-4 text-[24px] font-medium text-gray-100">내 프로필</h1>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col gap-4 px-4 pt-6">
        {/* 프로필 정보 카드 */}
        <div className="flex flex-col gap-6 rounded-[16px] bg-white px-3 py-6">
          <div className="flex flex-col items-end gap-6">
            {/* 사용자 이름 및 레벨 */}
            <div className="flex w-full items-center justify-between">
              <h2 className="text-[24px] font-semibold text-black">{currentUserName}</h2>
              <div className="flex items-center gap-2">
                <button
                  className={`cursor-pointer rounded-full px-4 py-2 transition-colors ${
                    levelHover ? 'bg-blue-3-hover' : 'bg-blue-3'
                  }`}
                  onMouseEnter={() => setLevelHover(true)}
                  onMouseLeave={() => setLevelHover(false)}
                >
                  <span className="text-body-01-regular text-black">{level}</span>
                </button>
                <button
                  className="h-[41px] w-[41px] cursor-pointer"
                  onMouseEnter={() => setEditHover(true)}
                  onMouseLeave={() => setEditHover(false)}
                  onClick={() => setIsNicknameModalOpen(true)}
                >
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-full transition-colors ${
                      editHover ? 'bg-gray-20' : 'bg-[#F2F6FA]'
                    }`}
                  >
                    <ProfileEdit className="h-[18px] w-[18px]" />
                  </div>
                </button>
              </div>
            </div>

            {/* 학습 통계 */}
            <div className="border-gray-20 flex w-full items-center justify-center gap-10 rounded-[16px] border px-4 py-3">
              <div className="flex w-[74px] flex-col items-center gap-1">
                <p className="text-body-02-regular text-[#7f7f7f]">학습한 단어</p>
                <p className="text-center leading-normal">
                  <span className="text-heading-01 text-black">{stats.wordsLearned}</span>
                  <span className="text-body-02-semibold text-black">개</span>
                </p>
              </div>
              <div className="flex w-[74px] flex-col items-center gap-1">
                <p className="text-body-02-regular text-[#7f7f7f]">학습한 상황</p>
                <p className="text-center leading-normal">
                  <span className="text-heading-01 text-black">{stats.situationsLearned}</span>
                  <span className="text-body-02-semibold text-black">개</span>
                </p>
              </div>
              <div className="flex w-[74px] flex-col items-center gap-1">
                <p className="text-body-02-regular text-[#7f7f7f]">학습한 키트</p>
                <p className="text-center leading-normal">
                  <span className="text-heading-01 text-black">{stats.kitsLearned}</span>
                  <span className="text-body-02-semibold text-black">개</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 그래프 섹션 (가로 스크롤) */}
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-[14px]">
            <GraphCard
              title="단어 성공 그래프"
              data={wordSuccessData}
              totalCount={totalSuccessCount}
              showArrow={true}
              ArrowIcon={ProfileRightArrow}
              onArrowClick={() => navigate('/profile/words')}
            />
            <GraphCard title="대화 학습 그래프" data={conversationSuccessData} totalCount={totalSuccessCount} />
          </div>
        </div>
      </div>

      {/* 여백 */}
      <div className="mt-6 flex-1"></div>

      {/* 설정 메뉴 */}
      <div className="mb-3 flex flex-col bg-white">
        <button
          className="h-16 cursor-pointer border-b border-[#f1f1f5] bg-white"
          onClick={() => navigate('/profile/guide')}
        >
          <div className="flex items-center justify-between px-7">
            <p className="text-body-01-semibold text-black">이용안내</p>
            <ProfileArrow className="h-[19px] w-[10px]" />
          </div>
        </button>
        <button
          className="h-16 cursor-pointer border-b border-[#f1f1f5] bg-white"
          onClick={() => navigate('/profile/account-settings')}
        >
          <div className="flex items-center justify-between px-7">
            <p className="text-body-01-semibold text-black">계정설정</p>
            <ProfileArrow className="h-[19px] w-[10px]" />
          </div>
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />

      {/* 닉네임 변경 모달 */}
      <NicknameChangeModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        currentNickname={currentUserName}
        onChangeNickname={handleNicknameChange}
      />
    </div>
  );
};

export default Profile;
