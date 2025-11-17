import type { SituationDetail } from '../models';

// 상황극 상세 조회 응답
export interface SituationDetailResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: SituationDetail;
}

