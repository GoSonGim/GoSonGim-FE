export interface ArticulationDialogue {
  id: number;
  text: string;
  userName: string;
  learningNumber: number;
}

export const MOCK_ARTICULATION_DIALOGUES: ArticulationDialogue[] = [
  { id: 1, text: '가자미', userName: '다현', learningNumber: 1 },
  { id: 2, text: '가자미', userName: '다현', learningNumber: 2 },
  { id: 3, text: '가자미', userName: '다현', learningNumber: 3 },
];

