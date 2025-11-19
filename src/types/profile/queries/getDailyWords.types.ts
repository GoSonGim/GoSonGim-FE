import type { DailyWord, PageInfo } from '../models';

export interface GetDailyWordsRequest {
  page?: number;
  size?: number;
}

export interface GetDailyWordsResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    totalWordCount: number;
    items: DailyWord[];
    pageInfo: PageInfo;
  };
}
