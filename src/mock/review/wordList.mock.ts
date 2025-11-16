export interface WordListItem {
  date: string; // 날짜 (예: "2025.10.4")
  words: string[]; // 단어 배열
  count: number; // 단어 개수
}

export const MOCK_WORD_LIST: WordListItem[] = [
  {
    date: '2025.10.4',
    words: ['내일', '면접', '학교', '책상', '인형'],
    count: 3,
  },
  {
    date: '2025.10.2',
    words: ['내일', '면접', '학교'],
    count: 2,
  },
  {
    date: '2025.10.1',
    words: ['내일', '면접', '학교'],
    count: 2,
  },
  {
    date: '2025.9.28',
    words: ['내일', '면접', '학교', '이어폰', '지갑', '과자'],
    count: 6,
  },
  {
    date: '2025.9.29',
    words: ['내일', '면접', '학교', '이어폰', '지갑', '과자'],
    count: 6,
  },
  {
    date: '2025.9.30',
    words: ['내일', '면접', '학교', '이어폰', '지갑', '과자'],
    count: 6,
  },
];

// 총 학습 횟수
export const TOTAL_STUDY_COUNT = 120;
