import type { ApiResponse } from '@/types/common/api.types';

export interface RandomWordsResult {
  words: string[];
  count: number;
}

export type RandomWordsResponse = ApiResponse<RandomWordsResult>;
