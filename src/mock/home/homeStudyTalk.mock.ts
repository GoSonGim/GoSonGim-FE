export interface PracticeKit {
  id: number;
  category: '호흡' | '조음위치' | '조음방법';
  title: string;
  createdAt: string;
}

export const practiceKitsMockData: PracticeKit[] = [
  {
    id: 1,
    category: '조음위치',
    title: '입술 소리\n키트',
    createdAt: '2025-01-15',
  },
  {
    id: 2,
    category: '조음위치',
    title: '혀끝소리\n키트',
    createdAt: '2025-01-14',
  },
  {
    id: 3,
    category: '조음위치',
    title: '목구멍 소리\n키트',
    createdAt: '2025-01-13',
  },
  {
    id: 4,
    category: '조음위치',
    title: '잇몸 소리\n키트',
    createdAt: '2025-01-12',
  },
  {
    id: 5,
    category: '조음방법',
    title: '파열음\n키트',
    createdAt: '2025-01-11',
  },
];
