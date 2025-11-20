import { useState, useMemo } from 'react';
import { useInfiniteKitListQuery } from './queries/useInfiniteKitListQuery';

type KitCategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';
type SortOption = '최신순' | '오래된순';

// 정렬 한글 → 영어 매핑
const sortMap: Record<SortOption, 'latest' | 'oldest'> = {
  최신순: 'latest',
  오래된순: 'oldest',
};

export const useKitReviewList = () => {
  const [selectedCategory, setSelectedCategory] = useState<KitCategoryOption>('전체');
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');

  // API에는 항상 'all'로 요청 (클라이언트에서 필터링)
  const apiSort = sortMap[selectedSort];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteKitListQuery({
    category: 'all',
    sort: apiSort,
    size: 20,
  });

  // 모든 페이지의 아이템을 평탄화 및 추가 필터링
  const kits = useMemo(() => {
    if (!data?.pages) return [];
    const allKits = data.pages.flatMap((page) => page.result.items);

    // 전체가 아닌 경우, 클라이언트 측에서도 카테고리 필터링
    if (selectedCategory === '전체') {
      return allKits;
    }

    // 선택된 카테고리와 키트 카테고리가 일치하는지 확인
    const filtered = allKits.filter((kit) => {
      const kitNameLower = kit.kitName.toLowerCase();
      const kitCategoryLower = kit.kitCategory ? kit.kitCategory.toLowerCase() : '';

      if (selectedCategory === '호흡') {
        // 키트 카테고리로 확인 (있는 경우)
        const isCategoryMatch =
          kitCategoryLower && (kitCategoryLower.includes('호흡') || kitCategoryLower === 'breath');

        // 키트 이름으로 확인 (kitCategory가 없는 경우 이름으로만 판단)
        const kitNameNoSpace = kitNameLower.replace(/\s/g, '');
        const isNameMatch =
          kitNameNoSpace.includes('길게소리내기') ||
          kitNameNoSpace.includes('일정한소리내기') ||
          kitNameLower.includes('큰소리내기');

        return isCategoryMatch || isNameMatch;
      }
      if (selectedCategory === '조음위치') {
        return (
          kitCategoryLower.includes('조음 위치') ||
          kitCategoryLower.includes('조음위치') ||
          kitCategoryLower === 'place'
        );
      }
      if (selectedCategory === '조음방법') {
        return (
          kitCategoryLower.includes('조음 방법') ||
          kitCategoryLower.includes('조음방법') ||
          kitCategoryLower === 'manner'
        );
      }

      return true;
    });

    return filtered;
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
