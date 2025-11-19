import type { Evaluation, FinalSummary } from '../models';

// 답변 평가 요청
export interface ReplyRequest {
  sessionId: string;
  answer: string;
  audioFileKey: string;
}

// 답변 평가 응답
export interface ReplyResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    evaluation: Evaluation;
    nextQuestion: string | null;
    turnIndex: number;
    isSessionEnd: boolean;
    finalSummary: FinalSummary | null;
  };
}

