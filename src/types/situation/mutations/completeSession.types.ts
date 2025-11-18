import type { FinalSummary } from '../models';

// 대화 종료 요청
export interface CompleteSessionRequest {
  sessionId: string;
}

// 대화 종료 응답
export interface CompleteSessionResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    situationLogId: number;
    finalSummary: FinalSummary;
  };
}

