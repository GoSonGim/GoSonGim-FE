import { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LeftIcon from '@/assets/svgs/review/review-leftarrow.svg';
import RestudyIcon from '@/assets/svgs/review/review-restudy.svg';
import AudioIcon from '@/assets/svgs/review/review-audio.svg';
import CategoryFilter from '@/components/studytalk/CategoryFilter';
import SituationCategoryFilter from '@/components/studytalk/SituationCategoryFilter';
import SortFilter from '@/components/studytalk/SortFilter';
import { useSituationReviewList } from '@/hooks/review/useSituationReviewList';
import { useKitReviewList } from '@/hooks/review/useKitReviewList';
import { getKitRoute } from '@/utils/review/kitRouteUtils';
import { getSituationRoute } from '@/utils/review/situationRouteUtils';

const ReviewPractice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // 'articulation' or 'roleplay'

  // 상황극용 API 데이터
  const {
    situations,
    selectedCategory: situationCategory,
    setSelectedCategory: setSituationCategory,
    selectedSort: situationSort,
    setSelectedSort: setSituationSort,
    fetchNextPage: fetchSituationNextPage,
    hasNextPage: hasSituationNextPage,
    isFetchingNextPage: isFetchingSituationNextPage,
    isLoading: isSituationLoading,
  } = useSituationReviewList();

  // 조음 키트용 API 데이터
  const {
    kits,
    selectedCategory: kitCategory,
    setSelectedCategory: setKitCategory,
    selectedSort: kitSort,
    setSelectedSort: setKitSort,
    fetchNextPage: fetchKitNextPage,
    hasNextPage: hasKitNextPage,
    isFetchingNextPage: isFetchingKitNextPage,
    isLoading: isKitLoading,
  } = useKitReviewList();

  // 무한 스크롤 ref
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 헤더 타이틀
  const headerTitle = type === 'roleplay' ? '상황극 복습' : '조음 키트 복습';

  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (type === 'roleplay' && hasSituationNextPage && !isFetchingSituationNextPage) {
            fetchSituationNextPage();
          } else if (type === 'articulation' && hasKitNextPage && !isFetchingKitNextPage) {
            fetchKitNextPage();
          }
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    type,
    hasSituationNextPage,
    isFetchingSituationNextPage,
    fetchSituationNextPage,
    hasKitNextPage,
    isFetchingKitNextPage,
    fetchKitNextPage,
  ]);

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex h-16 items-center justify-center bg-white px-4">
        <button onClick={() => navigate('/review')} className="absolute left-4 cursor-pointer p-2">
          <LeftIcon className="h-[18px] w-[10px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">{headerTitle}</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-white pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 필터 섹션 */}
        <div className="bg-white">
          {/* 카테고리 필터 - 타입에 따라 다르게 표시 */}
          {type === 'roleplay' ? (
            <SituationCategoryFilter selectedCategory={situationCategory} onCategoryChange={setSituationCategory} />
          ) : (
            <CategoryFilter selectedCategory={kitCategory} onCategoryChange={setKitCategory} />
          )}

          {/* 정렬 필터 */}
          <div className="flex justify-start px-4 pt-4 pb-2">
            <SortFilter
              selectedSort={type === 'roleplay' ? situationSort : kitSort}
              onSortChange={type === 'roleplay' ? setSituationSort : setKitSort}
            />
          </div>

          {/* 키트 테이블 */}
          <div className="flex flex-col">
            {/* 테이블 헤더 */}
            <div className="border-gray-10 mt-1 flex items-center justify-between border-b bg-white px-4 py-2">
              <p className="text-body-02-regular text-gray-50">{type === 'roleplay' ? '상황극' : '키트 종류'}</p>
              <div className="text-body-02-regular flex gap-[14px] text-gray-50">
                <p>재학습</p>
                <p>녹음 듣기</p>
              </div>
            </div>

            {/* 로딩 상태 */}
            {(type === 'roleplay' && isSituationLoading) || (type === 'articulation' && isKitLoading) ? (
              <div className="flex h-40 items-center justify-center bg-white">
                <p className="text-body-01-regular text-gray-50">로딩 중...</p>
              </div>
            ) : type === 'roleplay' ? (
              // 상황극 리스트 (API)
              <>
                {situations.length > 0 ? (
                  <>
                    {situations.map((situation) => (
                      <div
                        key={situation.situationId}
                        className="border-gray-10 flex h-20 items-center justify-between border-b bg-white px-4"
                      >
                        <div className="flex flex-col">
                          <p className="text-heading-02-semibold text-gray-100">{situation.situationName}</p>
                          <p className="text-detail-01 text-gray-50">{situation.situationCategory}</p>
                        </div>
                        <div className="flex gap-4">
                          {/* 재학습 버튼 */}
                          <button
                            onClick={() => navigate(getSituationRoute(situation.situationId))}
                            className="border-gray-20 bg-background-primary flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border"
                          >
                            <RestudyIcon className="pointer-events-none h-[52px] w-[52px]" />
                          </button>
                          {/* 녹음 듣기 버튼 */}
                          <button
                            onClick={() => navigate(`/review/practice/listen?recordingId=${situation.recordingId}`)}
                            className="border-blue-3 flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border bg-white"
                          >
                            <AudioIcon className="pointer-events-none h-[52px] w-[52px]" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 무한 스크롤 트리거 */}
                    {hasSituationNextPage && (
                      <div ref={loadMoreRef} className="flex h-20 items-center justify-center bg-white">
                        {isFetchingSituationNextPage ? (
                          <p className="text-body-01-regular text-gray-50">로딩 중...</p>
                        ) : (
                          <p className="text-body-01-regular text-gray-50">더보기</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-white">
                    <p className="text-body-01-regular text-gray-50">학습한 상황극이 없습니다.</p>
                  </div>
                )}
              </>
            ) : (
              // 조음 키트 리스트 (API)
              <>
                {kits.length > 0 ? (
                  <>
                    {kits.map((kit) => (
                      <div
                        key={kit.kitId}
                        className="border-gray-10 flex h-20 items-center justify-between border-b bg-white px-4"
                      >
                        <div className="flex flex-col">
                          <p className="text-heading-02-semibold text-gray-100">{kit.kitName}</p>
                          <p className="text-detail-01 text-gray-50">{kit.kitCategory}</p>
                        </div>
                        <div className="flex gap-4">
                          {/* 재학습 버튼 */}
                          <button
                            onClick={() => navigate(getKitRoute(kit.kitName))}
                            className="border-gray-20 bg-background-primary flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border"
                          >
                            <RestudyIcon className="pointer-events-none h-[52px] w-[52px]" />
                          </button>
                          {/* 녹음 듣기 버튼 */}
                          <button
                            onClick={() => navigate(`/review/practice/articulation-listen?kitId=${kit.kitId}`)}
                            className="border-blue-3 flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border bg-white"
                          >
                            <AudioIcon className="pointer-events-none h-[52px] w-[52px]" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 무한 스크롤 트리거 */}
                    {hasKitNextPage && (
                      <div ref={loadMoreRef} className="flex h-20 items-center justify-center bg-white">
                        {isFetchingKitNextPage ? (
                          <p className="text-body-01-regular text-gray-50">로딩 중...</p>
                        ) : (
                          <p className="text-body-01-regular text-gray-50">더보기</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-white">
                    <p className="text-body-01-regular text-gray-50">학습한 조음 키트가 없습니다.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewPractice;
