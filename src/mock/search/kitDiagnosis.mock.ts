// 진단 문장 데이터
export const diagnosisSentence = `솔직히 말해서, 깎아지른 바위 옆 맑은 계곡물에서 철수가 찰흙으로 흙을 빚어 닭을 쫓았다.`;

// 추천 키트 데이터
export interface RecommendedKit {
  id: string;
  category: string;
  title: string;
}

export const recommendedKitsMockData: RecommendedKit[] = [
  {
    id: 'steady-sound-1',
    category: '호흡 및 발성',
    title: '일정한 소리내기',
  },
  {
    id: 'steady-sound-2',
    category: '호흡 및 발성',
    title: '일정한 소리내기',
  },
  {
    id: 'steady-sound-3',
    category: '호흡 및 발성',
    title: '일정한 소리내기',
  },
  {
    id: 'steady-sound-4',
    category: '호흡 및 발성',
    title: '일정한 소리내기',
  },
];
