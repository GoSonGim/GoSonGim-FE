// 상황극 세션 정보
export interface SessionInfo {
  sessionId: string;
  situationId: number;
}

// 평가 결과
export interface Evaluation {
  isSuccess: boolean;
  feedback: string;
  score: number;
}

// 대화 턴
export interface Turn {
  turnIndex: number;
  question: string;
  answer?: string;
  audioFileKey?: string;
  evaluation?: Evaluation;
}

// 최종 요약
export interface FinalSummary {
  averageScore: number;
  finalFeedback: string;
}

// 상황극 로그 정보
export interface SituationLog {
  situationLogId: number;
  finalSummary: FinalSummary;
}
