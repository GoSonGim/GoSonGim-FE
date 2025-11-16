export interface Dialogue {
  id: number;
  speaker: 'AI' | 'USER';
  text: string;
  userName?: string;
  dialogueNumber?: number;
}

export const MOCK_DIALOGUES: Dialogue[] = [
  { id: 1, speaker: 'AI', text: '무엇을 주문하시겠어요?' },
  { id: 2, speaker: 'USER', text: '가자미', userName: '다현', dialogueNumber: 1 },
  { id: 3, speaker: 'AI', text: '무엇을 주문하시겠어요?' },
  { id: 4, speaker: 'USER', text: '가자미', userName: '다현', dialogueNumber: 2 },
  { id: 5, speaker: 'AI', text: '무엇을 주문하시겠어요?' },
  { id: 6, speaker: 'USER', text: '가자미', userName: '다현', dialogueNumber: 3 },
];
