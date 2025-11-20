import type { ApiResponse } from '@/types/common/api.types';

export interface MonthlyStudyResult {
  month: string;
  days: string[];
}

export type MonthlyStudyResponse = ApiResponse<MonthlyStudyResult>;
