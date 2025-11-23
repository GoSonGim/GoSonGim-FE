import { useMemo } from 'react';
import { useInfiniteKitListQuery } from '@/hooks/review/queries/useInfiniteKitListQuery';
import { filterKitsByCategory } from '@/utils/review';
import { sortMap } from '@/constants/review/practice';
import { useReviewStore } from '@/stores/useReviewStore';

export const useKitReviewList = () => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const selectedCategory = useReviewStore((state) => state.kitCategory);
  const selectedSort = useReviewStore((state) => state.kitSort);
  const setSelectedCategory = useReviewStore((state) => state.setKitCategory);
  const setSelectedSort = useReviewStore((state) => state.setKitSort);

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
