import type { ApiResponse } from '@/types/common/api.types';

export interface DailyStudyItem {
  type: 'SITUATION' | 'KIT';
  id: number;
  name: string;
  recordingId: number;
  createdAt: string;
}

export interface DailyStudyResult {
  items: DailyStudyItem[];
  count: number;
}

export type DailyStudyResponse = ApiResponse<DailyStudyResult>;
