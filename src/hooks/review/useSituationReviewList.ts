import { useState, useMemo } from 'react';
import { useInfiniteSituationListQuery } from './queries/useInfiniteSituationListQuery';
import type { SituationCategoryOption } from '@/components/studytalk/SituationCategoryFilter';

type SortOption = '최신순' | '오래된순';

// 카테고리 한글 → 영어 매핑
const categoryMap: Record<
  SituationCategoryOption,
  'all' | 'daily' | 'purchase' | 'medical' | 'traffic' | 'job' | 'social' | 'emergency'
> = {
  전체: 'all',
  일상: 'daily',
  구매: 'purchase',
  의료: 'medical',
  교통: 'traffic',
  직업: 'job',
  사교: 'social',
  비상: 'emergency',
};

// 정렬 한글 → 영어 매핑
const sortMap: Record<SortOption, 'latest' | 'oldest'> = {
  최신순: 'latest',
  오래된순: 'oldest',
};

export const useSituationReviewList = () => {
  const [selectedCategory, setSelectedCategory] = useState<SituationCategoryOption>('전체');
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');

  const apiCategory = categoryMap[selectedCategory];
  const apiSort = sortMap[selectedSort];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteSituationListQuery({
    category: apiCategory,
    sort: apiSort,
    size: 20,
  });

  // 모든 페이지의 아이템을 평탄화
  const situations = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.result.items);
  }, [data]);

  const totalCount = data?.pages[0]?.result.count || 0;

  return {
    situations,
    totalCount,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  };
};
