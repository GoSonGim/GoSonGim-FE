import type { ApiResponse } from '@/types/common/api.types';

export interface MonthlyStudyResult {
  month: string;
  days: number[]; // API에서 숫자 배열로 반환 (일자만)
}

export type MonthlyStudyResponse = ApiResponse<MonthlyStudyResult>;
