export interface SituationDetailRequest {
  recordingId: number;
}

export interface SituationDetailResponse {
  recordingId: number;
  situation: {
    id: number;
    name: string;
  };
  evaluation: {
    score: number;
    feedback: string;
  };
  conversation: Array<{
    question: string;
    answer: {
      text: string;
      audioUrl: string;
      audioExpiresIn: number;
    };
  }>;
}
