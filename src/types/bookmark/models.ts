// 북마크 타입
export type BookmarkType = 'KIT' | 'SITUATION';

// 정렬 타입
export type BookmarkSortType = 'latest' | 'oldest';

// 카테고리 타입
export type KitCategoryType = '전체' | '호흡' | '조음위치' | '조음방법';
export type SituationCategoryType = '전체' | '일상' | '구매' | '의료' | '교통' | '직업' | '사교' | '비상';

// 북마크 아이템 (목록 조회용)
export interface BookmarkItem {
  bookmarkId: number;
  kitId: number;
  kitName: string;
  kitCategory: string;
  createdAt: string;
}

// 북마크 미리보기 아이템
export interface BookmarkPreviewItem {
  bookmarkId: number;
  type: BookmarkType;
  title: string;
  category: string;
  createdAt: string;
}

