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
  nextQuestion?: string; // 평가 실패 시 다음에 재시도할 질문
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
