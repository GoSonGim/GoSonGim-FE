import type { ApiResponse } from '@/types/common';
import type { BookmarkPreviewItem } from '../models';

// 북마크 미리보기 응답 데이터
export interface BookmarkPreviewResult {
  count: number;
  bookmarkList: BookmarkPreviewItem[];
}

// 북마크 미리보기 응답
export type BookmarkPreviewResponse = ApiResponse<BookmarkPreviewResult>;

