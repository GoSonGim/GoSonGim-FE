export interface SituationPracticeKit {
  id: number;
  category: '일상' | '구매' | '의료' | '교통' | '직업' | '사교' | '비상';
  title: string;
  createdAt: string;
}

// 카테고리 전체 이름 매핑
export const categoryFullNames: Record<SituationPracticeKit['category'], string> = {
  일상: '일상',
  구매: '구매',
  의료: '의료 및 공공 서비스',
  교통: '교통',
  직업: '직업',
  사교: '사교',
  비상: '비상',
};

export const situationPracticeKitsMockData: SituationPracticeKit[] = [
  {
    id: 1,
    category: '의료',
    title: '치과에서\n충치 진찰받기',
    createdAt: '2025-01-15',
  },
  {
    id: 2,
    category: '일상',
    title: '카페에서\n커피 주문하기',
    createdAt: '2025-01-14',
  },
  {
    id: 3,
    category: '구매',
    title: '마트에서\n장보기',
    createdAt: '2025-01-13',
  },
  {
    id: 4,
    category: '의료',
    title: '병원에서\n감기 진료받기',
    createdAt: '2025-01-12',
  },
  {
    id: 5,
    category: '직업',
    title: '면접에서\n자기소개하기',
    createdAt: '2025-01-11',
  },
  {
    id: 6,
    category: '사교',
    title: '은행에서\n계좌 개설하기',
    createdAt: '2025-01-10',
  },
  {
    id: 7,
    category: '일상',
    title: '식당에서\n음식 주문하기',
    createdAt: '2025-01-09',
  },
  {
    id: 8,
    category: '구매',
    title: '옷가게에서\n옷 구매하기',
    createdAt: '2025-01-08',
  },
];
