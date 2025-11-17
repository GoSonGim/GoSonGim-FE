import type { ApiResponse } from '@/types/common';

// 조음발음 키트 북마크 추가 요청
export interface AddKitBookmarkRequest {
  kitList: number[];
}

// 조음발음 키트 북마크 추가 응답
export type AddKitBookmarkResponse = ApiResponse<null>;

