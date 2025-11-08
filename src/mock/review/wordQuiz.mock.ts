export interface QuizWord {
  id: number;
  text: string;
  category: string;
}
 
export const MOCK_QUIZ_WORDS: QuizWord[] = [
  { id: 1, text: '강가', category: '명사' },
  { id: 2, text: '바다', category: '명사' },
  { id: 3, text: '산', category: '명사' },
  { id: 4, text: '하늘', category: '명사' },
  { id: 5, text: '구름', category: '명사' },
];