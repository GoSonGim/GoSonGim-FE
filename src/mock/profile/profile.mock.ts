export interface MonthlyData {
  month: string;
  count: number;
}

export interface ProfileData {
  userName: string;
  level: string;
  stats: {
    wordsLearned: number;
    situationsLearned: number;
    kitsLearned: number;
  };
  wordSuccessData: MonthlyData[];
  conversationSuccessData: MonthlyData[];
  totalSuccessCount: number;
}

export const profileMockData: ProfileData = {
  userName: '고다현',
  level: '중급 3단계',
  stats: {
    wordsLearned: 24,
    situationsLearned: 5,
    kitsLearned: 5,
  },
  wordSuccessData: [
    { month: '1월', count: 3 },
    { month: '2월', count: 4 },
    { month: '3월', count: 4 },
    { month: '4월', count: 4 },
    { month: '5월', count: 5 },
  ],
  conversationSuccessData: [
    { month: '1월', count: 3 },
    { month: '2월', count: 4 },
    { month: '3월', count: 4 },
    { month: '4월', count: 4 },
    { month: '5월', count: 5 },
  ],
  totalSuccessCount: 1250,
};
