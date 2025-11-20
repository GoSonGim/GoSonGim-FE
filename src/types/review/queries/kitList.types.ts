import type { ApiResponse } from '@/types/common/api.types';
import type { KitReviewItem } from '../models';
import type { PageInfo } from './situationList.types';

export interface KitListResult {
  items: KitReviewItem[];
  count: number;
  pageInfo: PageInfo;
}

export type KitListResponse = ApiResponse<KitListResult>;

export interface KitListParams {
  category?: 'all' | 'breath' | 'organ' | 'place' | 'manner';
  sort?: 'latest' | 'oldest';
  page?: number;
  size?: number;
}

