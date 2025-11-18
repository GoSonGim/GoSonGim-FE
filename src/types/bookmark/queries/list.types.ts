import type { ApiResponse } from '@/types/common';
import type { BookmarkType, BookmarkSortType, BookmarkItem } from '../models';

// 북마크 목록 조회 요청 파라미터
export interface BookmarkListParams {
  type: BookmarkType;
  category?: string;
  sort?: BookmarkSortType;
}

// 북마크 목록 조회 응답 데이터
export interface BookmarkListResult {
  type: BookmarkType;
  sort: BookmarkSortType;
  totalCount: number;
  data: BookmarkItem[];
}

// 북마크 목록 조회 응답
export type BookmarkListResponse = ApiResponse<BookmarkListResult>;

