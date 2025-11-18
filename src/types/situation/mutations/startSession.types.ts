// 대화 시작 요청
export interface StartSessionRequest {
  situationId: number;
}

// 대화 시작 응답
export interface StartSessionResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    sessionId: string;
    question: string;
  };
}

