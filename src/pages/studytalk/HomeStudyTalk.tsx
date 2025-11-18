import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarkList } from '@/hooks/bookmark/queries/useBookmarkList';
import type { BookmarkSortType, BookmarkItem } from '@/types/bookmark';
import {
  getSituationCategoryName,
  getSituationCategoryParam,
  getKitCategoryParam,
} from '@/utils/studytalk/categoryUtils';
import BottomNav from '@/components/common/BottomNav';
import StudyTalkTabs from '@/components/studytalk/StudyTalkTabs';
import CategoryFilter from '@/components/studytalk/CategoryFilter';
import SituationCategoryFilter, { type SituationCategoryOption } from '@/components/studytalk/SituationCategoryFilter';
import SortFilter from '@/components/studytalk/SortFilter';
import PracticeKitCard from '@/components/studytalk/PracticeKitCard';
import SituationPracticeCard from '@/components/studytalk/SituationPracticeCard';
import EmptyState from '@/components/studytalk/EmptyState';
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

  // KIT 카테고리 변환
  const kitCategoryParam = getKitCategoryParam(selectedCategory);

  // 조음발음 키트 북마크 목록 조회
  const {
    data: kitBookmarksData,
    isLoading: isKitLoading,
    error: kitError,
  } = useBookmarkList({
    type: 'KIT',
    category: kitCategoryParam,
    sort: (selectedSort === '최신순' ? 'latest' : 'oldest') as BookmarkSortType,
  });

  // SITUATION 카테고리 변환
  const situationCategoryParam = getSituationCategoryParam(selectedSituationCategory);

  // 상황극 북마크 목록 조회
  const {
    data: situationBookmarksData,
    isLoading: isSituationLoading,
    error: situationError,
  } = useBookmarkList({
    type: 'SITUATION',
    category: situationCategoryParam,
    sort: (selectedSituationSort === '최신순' ? 'latest' : 'oldest') as BookmarkSortType,
  });

  // 정렬 로직 적용
  const visibleKits = useMemo(() => {
    const data = kitBookmarksData?.result.data || [];
    return selectedSort === '오래된순' ? [...data].reverse() : data;
  }, [kitBookmarksData, selectedSort]);

  const visibleSituationKits = useMemo(() => {
    const data = situationBookmarksData?.result.data || [];
    return selectedSituationSort === '오래된순' ? [...data].reverse() : data;
  }, [situationBookmarksData, selectedSituationSort]);

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
              {isKitLoading ? (
                <div className="text-body-14-regular text-gray-60">로딩 중...</div>
              ) : kitError ? (
                <div className="text-body-14-regular text-red-500">오류가 발생했습니다.</div>
              ) : visibleKits.length === 0 ? (
                <div className="mt-[48px]">
                  <EmptyState />
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  {/* 2열 그리드 */}
                  {Array.from({ length: Math.ceil(visibleKits.length / 2) }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-[16px]">
                      {visibleKits.slice(rowIndex * 2, rowIndex * 2 + 2).map((kit: BookmarkItem) => (
                        <PracticeKitCard
                          key={kit.bookmarkId}
                          bookmarkId={kit.bookmarkId}
                          category={kit.kitCategory}
                          title={kit.kitName}
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
              {isSituationLoading ? (
                <div className="text-body-14-regular text-gray-60">로딩 중...</div>
              ) : situationError ? (
                <div className="text-body-14-regular text-red-500">오류가 발생했습니다.</div>
              ) : visibleSituationKits.length === 0 ? (
                <div className="mt-[48px]">
                  <EmptyState />
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  {/* 2열 그리드 */}
                  {Array.from({ length: Math.ceil(visibleSituationKits.length / 2) }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-[16px]">
                      {visibleSituationKits.slice(rowIndex * 2, rowIndex * 2 + 2).map((kit: BookmarkItem) => (
                        <SituationPracticeCard
                          key={kit.bookmarkId}
                          bookmarkId={kit.bookmarkId}
                          categoryFull={getSituationCategoryName(kit.kitCategory)}
                          title={kit.kitName}
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
