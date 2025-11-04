import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import StudyTalkTabs from '@/components/studyTalk/StudyTalkTabs';
import CategoryFilter from '@/components/studyTalk/CategoryFilter';
import SituationCategoryFilter, { type SituationCategoryOption } from '@/components/studyTalk/SituationCategoryFilter';
import SortFilter from '@/components/studyTalk/SortFilter';
import PracticeKitCard from '@/components/studyTalk/PracticeKitCard';
import SituationPracticeCard from '@/components/studyTalk/SituationPracticeCard';
import EmptyState from '@/components/studyTalk/EmptyState';
import { practiceKitsMockData } from '@/mock/home/homeStudyTalk.mock';
import { situationPracticeKitsMockData, categoryFullNames } from '@/mock/home/homeSituation.mock';
import { useStudyTalkStore } from '@/stores/studyTalkStore';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';

type TabType = '조음발음' | '상황극';
type CategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';
type SortOption = '최신순' | '오래된순';

export default function HomeStudyTalk() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('조음발음');

  // 조음발음 연습용 state
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('전체');
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');

  // 상황극 연습용 state
  const [selectedSituationCategory, setSelectedSituationCategory] = useState<SituationCategoryOption>('전체');
  const [selectedSituationSort, setSelectedSituationSort] = useState<SortOption>('최신순');

  const { removedKits, removeKit, removedSituationKits, removeSituationKit } = useStudyTalkStore();

  // 조음발음 연습: 필터링 및 정렬된 키트 목록 계산
  const visibleKits = useMemo(() => {
    // 제거되지 않은 키트만 필터링
    let filtered = practiceKitsMockData.filter((kit) => !removedKits.includes(kit.id));

    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      filtered = filtered.filter((kit) => kit.category === selectedCategory);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return selectedSort === '최신순' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [removedKits, selectedCategory, selectedSort]);

  // 상황극 연습: 필터링 및 정렬된 키트 목록 계산
  const visibleSituationKits = useMemo(() => {
    // 제거되지 않은 키트만 필터링
    let filtered = situationPracticeKitsMockData.filter((kit) => !removedSituationKits.includes(kit.id));

    // 카테고리 필터링
    if (selectedSituationCategory !== '전체') {
      filtered = filtered.filter((kit) => kit.category === selectedSituationCategory);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return selectedSituationSort === '최신순' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [removedSituationKits, selectedSituationCategory, selectedSituationSort]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* Header */}
      <div className="relative flex h-16 items-center overflow-clip bg-white px-0 py-[8px]">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-[16px] flex size-[48px] cursor-pointer items-center justify-center p-[8px]"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[10px]" />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-center text-[20px] leading-normal font-normal text-gray-100">
          내 학습
        </p>
      </div>

      {/* Tabs */}
      <StudyTalkTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white px-0 pt-[16px] pb-40 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Section Title */}
        <div className="mb-[16px] flex items-center px-[16px] py-0">
          <p className="text-heading-01 text-center text-gray-100">상황극 연습</p>
        </div>

        {activeTab === '조음발음' ? (
          <>
            {/* 조음발음 연습 탭 */}
            {/* Category Filter */}
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

            {/* Sort Filter */}
            <div className="mt-[16px] px-[16px] py-0">
              <SortFilter selectedSort={selectedSort} onSortChange={setSelectedSort} />
            </div>

            {/* Grid or Empty State */}
            <div className="mt-[16px] px-[16px]">
              {visibleKits.length === 0 ? (
                <div className="mt-[48px]">
                  <EmptyState />
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  {/* 2열 그리드 */}
                  {Array.from({ length: Math.ceil(visibleKits.length / 2) }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-[16px]">
                      {visibleKits.slice(rowIndex * 2, rowIndex * 2 + 2).map((kit) => (
                        <PracticeKitCard
                          key={kit.id}
                          id={kit.id}
                          category={kit.category}
                          title={kit.title}
                          onRemove={removeKit}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 상황극 연습 탭 */}
            {/* Category Filter with Horizontal Scroll */}
            <SituationCategoryFilter
              selectedCategory={selectedSituationCategory}
              onCategoryChange={setSelectedSituationCategory}
            />

            {/* Sort Filter */}
            <div className="mt-[16px] px-[16px] py-0">
              <SortFilter selectedSort={selectedSituationSort} onSortChange={setSelectedSituationSort} />
            </div>

            {/* Grid or Empty State */}
            <div className="mt-[16px] px-[16px]">
              {visibleSituationKits.length === 0 ? (
                <div className="mt-[48px]">
                  <EmptyState />
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  {/* 2열 그리드 */}
                  {Array.from({ length: Math.ceil(visibleSituationKits.length / 2) }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-[16px]">
                      {visibleSituationKits.slice(rowIndex * 2, rowIndex * 2 + 2).map((kit) => (
                        <SituationPracticeCard
                          key={kit.id}
                          id={kit.id}
                          categoryFull={categoryFullNames[kit.category]}
                          title={kit.title}
                          onRemove={removeSituationKit}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
