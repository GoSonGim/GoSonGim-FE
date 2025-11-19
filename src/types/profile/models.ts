export interface User {
  id: number;
  nickname: string;
  level: string;
}

export interface Stats {
  wordCount: number;
  situationCount: number;
  kitCount: number;
}

export interface GraphData {
  totalSuccessCount: number;
  recentDayCounts: number[]; // 최근 5일 (과거→오늘)
}

export interface StatsGraph {
  kit: GraphData;
  situation: GraphData;
}

export interface DailyWord {
  date: string; // "2025.11.3"
  wordCount: number;
  words: string[];
}

export interface PageInfo {
  page: number;
  size: number;
  hasNext: boolean;
}
