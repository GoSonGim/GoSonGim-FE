export interface ReviewPracticeKit {
  id: number;
  name: string;
  date: string; // "2025.10.04" 형식
  category: '호흡' | '조음위치' | '조음방법';
}

// 조음·발음 복습용 Mock 데이터
export const ARTICULATION_PRACTICE_KITS: ReviewPracticeKit[] = [
  {
    id: 1,
    name: '목구멍 소리 키트',
    date: '2025.10.24',
    category: '조음위치',
  },
  {
    id: 2,
    name: '길게 소리내기 키트',
    date: '2025.10.20',
    category: '호흡',
  },
  {
    id: 3,
    name: '턱 움직임 키트',
    date: '2025.10.15',
    category: '조음방법',
  },
  {
    id: 4,
    name: '입술 소리 키트',
    date: '2025.10.10',
    category: '조음위치',
  },
  {
    id: 5,
    name: '짧게 소리내기 키트',
    date: '2025.10.05',
    category: '호흡',
  },
  {
    id: 6,
    name: '혀 움직임 키트',
    date: '2025.10.02',
    category: '조음방법',
  },
];

// 상황극 복습용 Mock 데이터
export const ROLEPLAY_PRACTICE_KITS: ReviewPracticeKit[] = [
  {
    id: 1,
    name: '치과에서 충치 진찰받기',
    date: '2025.10.22',
    category: '조음위치',
  },
  {
    id: 2,
    name: '편의점에서 물건 찾기',
    date: '2025.10.18',
    category: '호흡',
  },
  {
    id: 3,
    name: '우체국에서 택배 보내기',
    date: '2025.10.12',
    category: '조음방법',
  },
  {
    id: 4,
    name: '약국에서 약 구매하기',
    date: '2025.10.08',
    category: '조음위치',
  },
  {
    id: 5,
    name: '식당에서 음식 주문하기',
    date: '2025.10.03',
    category: '호흡',
  },
  {
    id: 6,
    name: '버스 타고 목적지 찾기',
    date: '2025.09.28',
    category: '조음방법',
  },
];
