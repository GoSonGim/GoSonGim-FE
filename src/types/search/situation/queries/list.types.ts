import type { Situation } from '../models';

// 상황극 목록 조회 응답
export interface SituationListResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    situations: Situation[];
  };
}

