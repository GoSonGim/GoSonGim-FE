import type { ApiResponse } from '@/types/common/api.types';

export interface StreakDaysResult {
  streakDays: number;
  learnedToday: boolean;
}

export type GetStreakDaysResponse = ApiResponse<StreakDaysResult>;
