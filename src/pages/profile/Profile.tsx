import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import useEmblaCarousel from 'embla-carousel-react';
import ProfileEdit from '@/assets/svgs/profile/profilehome/profile-edit.svg';
import ProfileRightArrow from '@/assets/svgs/profile/profilehome/profile-rightarrow.svg';
import ProfileArrow from '@/assets/svgs/profile/profilehome/profile-arrow.svg';
import GraphCard from '@/components/profile/GraphCard';
import NicknameChangeModal from '@/components/profile/NicknameChangeModal';
import { useProfileQuery } from '@/hooks/profile/queries/useProfileQuery';
import { useStatsQuery } from '@/hooks/profile/queries/useStatsQuery';
import { transformGraphData } from '@/utils/profile/graphUtils';
import { logger } from '@/utils/common/loggerUtils';

const Profile = () => {
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });
  const [levelHover, setLevelHover] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const { data: profileData, isLoading, error } = useProfileQuery();
  const { data: statsData, isLoading: isStatsLoading } = useStatsQuery();
  const [currentUserName, setCurrentUserName] = useState('');

  // 디버깅: Profile API 응답 확인
  useEffect(() => {
    logger.log('=== Profile API Response ===');
    logger.log('isLoading:', isLoading);
    logger.log('error:', error);
    logger.log('profileData:', profileData);
    logger.log('Full response:', JSON.stringify(profileData, null, 2));
    logger.log('===========================');
  }, [profileData, isLoading, error]);

  // 디버깅: Stats API 응답 확인
  useEffect(() => {
    logger.log('=== Stats API Response ===');
    logger.log('isLoading:', isStatsLoading);
    logger.log('statsData:', statsData);
    logger.log('Stats:', statsData?.result.stats);
    logger.log('Graph Kit:', statsData?.result.graph.kit);
    logger.log('Graph Situation:', statsData?.result.graph.situation);
    logger.log('==========================');
  }, [statsData, isStatsLoading]);

  useEffect(() => {
    if (profileData?.result.user.nickname) {
      logger.log('✅ Setting nickname to:', profileData.result.user.nickname);
      setCurrentUserName(profileData.result.user.nickname);
    } else {
      logger.log('⚠️ No nickname in profileData');
    }
  }, [profileData]);

  // API 데이터 변환
  const stats = statsData?.result.stats || { wordCount: 0, situationCount: 0, kitCount: 0 };
  const wordGraphData = statsData?.result.graph.kit.recentDayCounts
    ? transformGraphData(statsData.result.graph.kit.recentDayCounts)
    : [];
  const conversationGraphData = statsData?.result.graph.situation.recentDayCounts
    ? transformGraphData(statsData.result.graph.situation.recentDayCounts)
    : [];
  const kitTotalCount = statsData?.result.graph.kit.totalSuccessCount || 0;
  const situationTotalCount = statsData?.result.graph.situation.totalSuccessCount || 0;

  return (
    <div className="bg-background-primary relative flex h-full w-full flex-col">
      {/* 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto pb-14 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 상단 헤더 */}
        <div className="flex h-16 items-center justify-between bg-white px-4 py-2">
          <div className="flex items-center justify-center px-4 py-0">
            <h1 className="text-[24px] leading-normal font-medium text-gray-100">내 프로필</h1>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col gap-4 px-4 pt-6 pb-0">
          {/* 프로필 정보 카드 */}
          <div className="flex flex-col gap-6 rounded-[16px] bg-white px-3 py-6 shadow-lg">
            <div className="flex flex-col items-end gap-6">
              {/* 사용자 이름 및 레벨 */}
              <div className="flex w-full items-center justify-between">
                <h2 className="text-[24px] font-semibold text-black">{isLoading ? '로딩 중...' : currentUserName}</h2>
                <div className="flex items-center gap-2">
                  <button
                    className={`cursor-pointer rounded-full px-4 py-2 transition-colors ${
                      levelHover ? 'bg-blue-3-hover' : 'bg-blue-3'
                    }`}
                    onMouseEnter={() => setLevelHover(true)}
                    onMouseLeave={() => setLevelHover(false)}
                  >
                    <span className="text-body-01-regular text-black">
                      {isLoading ? '...' : profileData?.result.user.level}
                    </span>
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
                    <span className="text-heading-01 text-black">{stats.wordCount}</span>
                    <span className="text-body-02-semibold text-black">개</span>
                  </p>
                </div>
                <div className="flex w-[74px] flex-col items-center gap-1">
                  <p className="text-body-02-regular text-[#7f7f7f]">학습한 상황</p>
                  <p className="text-center leading-normal">
                    <span className="text-heading-01 text-black">{stats.situationCount}</span>
                    <span className="text-body-02-semibold text-black">개</span>
                  </p>
                </div>
                <div className="flex w-[74px] flex-col items-center gap-1">
                  <p className="text-body-02-regular text-[#7f7f7f]">학습한 키트</p>
                  <p className="text-center leading-normal">
                    <span className="text-heading-01 text-black">{stats.kitCount}</span>
                    <span className="text-body-02-semibold text-black">개</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 그래프 섹션 (가로 스크롤) */}
          <div className="embla overflow-hidden py-6" ref={emblaRef}>
            <div className="embla__container flex gap-[14px]">
              <GraphCard
                title="단어 성공 그래프"
                data={wordGraphData}
                totalCount={kitTotalCount}
                showArrow={true}
                ArrowIcon={ProfileRightArrow}
                onArrowClick={() => navigate('/profile/words')}
              />
              <GraphCard title="대화 학습 그래프" data={conversationGraphData} totalCount={situationTotalCount} />
            </div>
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="flex flex-col bg-white">
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
            className="h-16 cursor-pointer bg-white"
            onClick={() => navigate('/profile/account-settings')}
          >
            <div className="flex items-center justify-between px-7">
              <p className="text-body-01-semibold text-black">계정설정</p>
              <ProfileArrow className="h-[19px] w-[10px]" />
            </div>
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 (고정) */}
      <BottomNav />

      {/* 닉네임 변경 모달 */}
      <NicknameChangeModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        currentNickname={currentUserName}
      />
    </div>
  );
};

export default Profile;
