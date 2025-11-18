import type { ApiResponse } from '@/types/common';

// 상황극 북마크 추가 요청
export interface AddSituationBookmarkRequest {
  situationList: number[];
}

// 상황극 북마크 추가 응답
export type AddSituationBookmarkResponse = ApiResponse<null>;

