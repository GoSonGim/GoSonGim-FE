export interface HomeMyStudyItemMock {
  id: number;
  category: string;
  title: string;
  badge: string;
}

export const homeMyStudyMockData: HomeMyStudyItemMock[] = [
  {
    id: 1,
    category: '일상생활 및 가정',
    title: '음식 주문하기',
    badge: '상황 연습',
  },
  {
    id: 2,
    category: '조음 기관별 유연성',
    title: '턱 움직이기',
    badge: '조음 키트',
  },
  {
    id: 3,
    category: '조음 방식별 훈련',
    title: '마찰음 내기',
    badge: '조음 키트',
  },
];
