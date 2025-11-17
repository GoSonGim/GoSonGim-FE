import { useState, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import ArrowButton from '@/assets/svgs/home/arrow-button.svg';
import ArrowRight from '@/assets/svgs/search/studyfind-arrowright.svg';
import { situationCategoriesMockData } from '@/mock/search/search.mock';
import { useKitCategories } from '@/hooks/talkingkit/queries/useKitCategories';
import { useSituations } from '@/hooks/search/queries/useSituations';
import { getSituationCategoryQuery } from '@/utils/common/situationUtils';
import { logger } from '@/utils/common/loggerUtils';

// Lazy load home icon
const HomeIcon = lazy(() => import('@/assets/svgs/search/studyfind-home.svg'));

type TabType = '조음발음' | '상황극';

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('조음발음');
  const { data: kitCategoriesData, isLoading, error } = useKitCategories();
  const { data: situationsData } = useSituations('daily');

  // API 응답 데이터 로깅
  useEffect(() => {
    if (kitCategoriesData) {
      logger.log('조음 키트 카테고리 API 응답:', kitCategoriesData);
      logger.log('카테고리 목록:', kitCategoriesData.result.categories);
    }
  }, [kitCategoriesData]);

  useEffect(() => {
    if (error) {
      logger.error('조음 키트 카테고리 조회 실패:', error);
    }
  }, [error]);

  // 상황극 API 응답 데이터 로깅
  useEffect(() => {
    if (situationsData) {
      logger.log('상황극 목록 API 응답:', situationsData);
      logger.log('상황극 목록:', situationsData.result.situations);
    }
  }, [situationsData]);

  const handleDiagnosisClick = () => {
    navigate('/search/diagnosis');
  };

  const handleKitClick = (categoryId: number) => {
    if (categoryId === 1) {
      // 호흡 및 발성 기초 키트
      navigate('/talkingkit');
    } else if (categoryId === 2) {
      // 조음 위치별 연습 키트
      navigate('/search/articulation-position');
    } else if (categoryId === 3) {
      // 조음 방식별 연습 키트
      navigate('/search/articulation-method');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    const categoryQuery = getSituationCategoryQuery(categoryId);
    navigate(`/search/situation/${categoryQuery}`);
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* Header */}
      <div className="relative flex h-16 items-center overflow-clip bg-white px-0 py-2">
        <div className="flex w-full items-center justify-center px-4 py-0">
          <p className="text-center text-[24px] leading-normal font-medium text-gray-100">학습탐색</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full items-center justify-between bg-white">
        <button
          onClick={() => setActiveTab('조음발음')}
          className={`relative flex h-14 w-[196.5px] items-center justify-center overflow-clip ${
            activeTab === '조음발음' ? 'border-blue-1 border-b' : ''
          }`}
        >
          <p
            className={`text-heading-02-semibold cursor-pointer text-center ${
              activeTab === '조음발음' ? 'text-gray-100' : 'text-gray-40'
            }`}
          >
            조음•발음 연습
          </p>
        </button>
        <button
          onClick={() => setActiveTab('상황극')}
          className={`relative flex h-14 flex-1 cursor-pointer items-center justify-center overflow-clip ${
            activeTab === '상황극' ? 'border-blue-1 border-b' : ''
          }`}
        >
          <p
            className={`text-heading-02-semibold cursor-pointer text-center ${
              activeTab === '상황극' ? 'text-gray-100' : 'text-gray-40'
            }`}
          >
            상황극 연습
          </p>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-40 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {activeTab === '조음발음' ? (
          <div className="flex flex-col gap-10 px-4 pt-[36px]">
            {/* 진단 받기 섹션 */}
            <button
              onClick={handleDiagnosisClick}
              className="border-blue-2 flex h-[88px] w-full items-center justify-between rounded-2xl border bg-white p-4 transition-colors"
            >
              <div className="flex w-[232px] flex-col items-start leading-normal">
                <p className="text-detail-01 w-full text-gray-50">체계적인 근육 강화와 발음 연습!</p>
                <p className="text-heading-01 w-full text-gray-100">조음•발음 키트 진단 받기</p>
              </div>
              <div className="bg-blue-2 flex size-12 cursor-pointer items-center justify-center rounded-full">
                <ArrowButton className="h-[48px] w-[48px]" />
              </div>
            </button>

            {/* 조음발음 키트 리스트 */}
            <div className="flex flex-col gap-6">
              <p className="text-heading-01 text-gray-100">조음•발음 연습</p>
              {isLoading ? (
                <div className="text-body-14-regular text-gray-60">로딩 중...</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {kitCategoriesData?.result.categories.map((kit) => (
                    <button
                      key={kit.categoryId}
                      onClick={() => handleKitClick(kit.categoryId)}
                      className="border-gray-10 hover:bg-gray-10 flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 py-[19px] transition-colors"
                    >
                      <p className="text-heading-02-semibold text-gray-100">{kit.categoryName}</p>
                      <div className="size-5 cursor-pointer">
                        <ArrowRight className="size-5" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 px-4 pt-[36px]">
            {/* 상황극 연습 타이틀 */}
            <p className="text-heading-01 text-gray-100">상황극 연습</p>

            {/* 카테고리 그리드 */}
            <div className="flex flex-col gap-4">
              {Array.from({ length: Math.ceil(situationCategoriesMockData.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4">
                  {situationCategoriesMockData.slice(rowIndex * 2, rowIndex * 2 + 2).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="hover:bg-gray-10 flex w-[173px] cursor-pointer flex-col gap-4 rounded-2xl bg-white px-4 py-2 transition-colors"
                    >
                      <p className="text-heading-02-semibold min-w-full text-gray-100">{category.title}</p>
                      <div className="flex w-full justify-end">
                        <div className="size-16">
                          <Suspense fallback={<div className="bg-gray-10 size-16 rounded-lg" />}>
                            <HomeIcon className="size-16" />
                          </Suspense>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
