import { useState, useMemo } from 'react';
import { useInfiniteKitListQuery } from './queries/useInfiniteKitListQuery';
import { filterKitsByCategory } from '@/utils/review';
import { sortMap } from '@/constants/review/sort';
import type { KitCategoryOption, SortOption } from '@/constants/review/sort';

export const useKitReviewList = () => {
  const [selectedCategory, setSelectedCategory] = useState<KitCategoryOption>('전체');
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');

  const apiSort = sortMap[selectedSort];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteKitListQuery({
    category: 'all',
    sort: apiSort,
    size: 20,
  });

  // 모든 페이지의 아이템을 평탄화 및 필터링
  const kits = useMemo(() => {
    if (!data?.pages) return [];
    const allKits = data.pages.flatMap((page) => page.result.items);
    return filterKitsByCategory(allKits, selectedCategory);
  }, [data, selectedCategory]);

  return {
    kits,
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
