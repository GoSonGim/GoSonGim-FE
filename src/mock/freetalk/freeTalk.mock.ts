export type ConversationStatus = 'pending' | 'active' | 'completed';

export interface Conversation {
  id: number;
  question: string;
  answer?: string;
  status: ConversationStatus;
}

export const conversationsMock: Conversation[] = [
  {
    id: 1,
    question: '가장 최근에 본 영화가 뭐야?',
    status: 'active',
  },
  {
    id: 2,
    question: '오늘 점심으로 뭐 먹었어?',
    status: 'pending',
  },
  {
    id: 3,
    question: '주말에 뭐 할 거야?',
    status: 'pending',
  },
  {
    id: 4,
    question: '요즘 가장 관심 있는 취미가 뭐야?',
    status: 'pending',
  },
  {
    id: 5,
    question: '좋아하는 음식이 뭐야?',
    status: 'pending',
  },
];

// Mock 답변 데이터 (녹음 시뮬레이션 후 자동 저장)
export const mockAnswers: Record<number, string> = {
  1: '저는 최근에 인터스텔라를 봤어요',
  2: '김치찌개를 먹었습니다',
  3: '친구들과 등산을 갈 예정이에요',
  4: '요즘 사진 찍기에 관심이 많아요',
  5: '파스타를 좋아합니다',
};
