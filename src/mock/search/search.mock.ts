// 조음발음 연습 키트 데이터
export interface ArticulationKit {
  id: string;
  title: string;
}

export const articulationKitsMockData: ArticulationKit[] = [
  {
    id: 'breathing-kit',
    title: '호흡 및 발성 기초 키트',
  },
  {
    id: 'articulation-position-kit',
    title: '조음 위치별 연습 키트',
  },
  {
    id: 'articulation-method-kit',
    title: '조음 방식별 연습 키트',
  },
];

// 상황극 연습 카테고리 데이터
export interface SituationCategory {
  id: string;
  title: string;
  icon: string; // 아이콘 경로
}

export const situationCategoriesMockData: SituationCategory[] = [
  {
    id: 'daily-life',
    title: '일상생활 및 가정',
    icon: '@/assets/svgs/search/studyfind-category1',
  },
  {
    id: 'shopping',
    title: '구매 및 쇼핑',
    icon: '@/assets/svgs/search/studyfind-category2',
  },
  {
    id: 'medical-service',
    title: '의료•공공 서비스',
    icon: '@/assets/svgs/search/studyfind-category3',
  },
  {
    id: 'transportation',
    title: '교통 및 길찾기',
    icon: '@/assets/svgs/search/studyfind-category4',
  },
  {
    id: 'job-education',
    title: '직업 및 교육',
    icon: '@/assets/svgs/search/studyfind-category5',
  },
  {
    id: 'social-relationship',
    title: '사교 및 관계',
    icon: '@/assets/svgs/search/studyfind-category6',
  },
  {
    id: 'emergency',
    title: '비상 및 문제해결',
    icon: '@/assets/svgs/search/studyfind-category7',
  },
];
