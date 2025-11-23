export type KitCategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';
export type SortOption = '최신순' | '오래된순';

export const sortMap: Record<SortOption, 'latest' | 'oldest'> = {
  최신순: 'latest',
  오래된순: 'oldest',
};
