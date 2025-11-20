import type { ApiResponse } from '@/types/common/api.types';
import type { SituationReviewItem } from '../models';

export interface PageInfo {
  page: number;
  size: number;
  hasNext: boolean;
}

export interface SituationListResult {
  items: SituationReviewItem[];
  count: number;
  pageInfo: PageInfo;
}

export type SituationListResponse = ApiResponse<SituationListResult>;

export interface SituationListParams {
  category?: 'all' | 'daily' | 'purchase' | 'medical' | 'traffic' | 'job' | 'social' | 'emergency';
  sort?: 'latest' | 'oldest';
  page?: number;
  size?: number;
}
