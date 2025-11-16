import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LeftIcon from '@/assets/svgs/review/review-leftarrow.svg';
import RestudyIcon from '@/assets/svgs/review/review-restudy.svg';
import AudioIcon from '@/assets/svgs/review/review-audio.svg';
import CategoryFilter from '@/pages/studytalk/CategoryFilter';
import SortFilter from '@/pages/studytalk/SortFilter';
import { ARTICULATION_PRACTICE_KITS, ROLEPLAY_PRACTICE_KITS } from '@/mock/review/reviewPractice.mock';

type CategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';
type SortOption = '최신순' | '오래된순';

const ReviewPractice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // 'articulation' or 'roleplay'

  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('전체');
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');

  // 타입에 따라 데이터 선택
  const kits = type === 'roleplay' ? ROLEPLAY_PRACTICE_KITS : ARTICULATION_PRACTICE_KITS;

  // 헤더 타이틀
  const headerTitle = type === 'roleplay' ? '상황극 복습' : '조음 키트 복습';

  // 필터링 및 정렬된 키트 목록
  const filteredAndSortedKits = useMemo(() => {
    // 카테고리 필터링
    let filtered = kits;
    if (selectedCategory !== '전체') {
      filtered = kits.filter((kit) => kit.category === selectedCategory);
    }

    // 날짜순 정렬
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-'));
      const dateB = new Date(b.date.replace(/\./g, '-'));
      return selectedSort === '최신순' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    return sorted;
  }, [kits, selectedCategory, selectedSort]);

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
      <main className="flex flex-1 flex-col overflow-y-auto pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 필터 섹션 - 흰색 박스 */}
        <div className="bg-white">
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          {/* 정렬 필터 */}
          <div className="flex justify-start px-4 pt-4 pb-2">
            <SortFilter selectedSort={selectedSort} onSortChange={setSelectedSort} />
          </div>

          {/* 키트 테이블 */}
          <div className="flex flex-col">
            {/* 테이블 헤더 */}
            <div className="border-gray-10 mt-1 flex items-center justify-between border-b bg-white px-4 py-2">
              <p className="text-body-02-regular text-gray-50">키트 종류</p>
              <div className="text-body-02-regular flex gap-[14px] text-gray-50">
                <p>재학습</p>
                <p>녹음 듣기</p>
              </div>
            </div>

            {/* 키트 리스트 */}
            {filteredAndSortedKits.length > 0 ? (
              filteredAndSortedKits.map((kit) => (
                <div
                  key={kit.id}
                  className="border-gray-10 flex h-20 items-center justify-between border-b bg-white px-4"
                >
                  <p className="text-heading-02-semibold text-gray-100">{kit.name}</p>
                  <div className="flex gap-4">
                    {/* 재학습 버튼 */}
                    <button className="border-gray-20 bg-background-primary flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border">
                      <RestudyIcon className="pointer-events-none h-[52px] w-[52px]" />
                    </button>
                    {/* 녹음 듣기 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const listenPath =
                          type === 'roleplay'
                            ? `/review/practice/listen?id=${kit.id}`
                            : `/review/practice/articulation-listen?id=${kit.id}`;
                        navigate(listenPath);
                      }}
                      className="border-blue-3 flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border bg-white"
                    >
                      <AudioIcon className="pointer-events-none h-[52px] w-[52px]" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-40 items-center justify-center bg-white">
                <p className="text-body-01-regular text-gray-50">해당 카테고리의 키트가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewPractice;
