export interface HomeMoreContentsItemMock {
  id: number;
  icon: 'chat' | 'doctor';
  subtitle: string;
  title: string;
}

export const homeMoreContentsMockData: HomeMoreContentsItemMock[] = [
  {
    id: 1,
    icon: 'chat',
    subtitle: 'AI와 편안하게 이야기해봐요!',
    title: '자유대화 시작하기',
  },
  {
    id: 2,
    icon: 'doctor',
    subtitle: '체계적인 근육 강화와 발음 연습!',
    title: '조음키트 진단 받기',
  },
];
