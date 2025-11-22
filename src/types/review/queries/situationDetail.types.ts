import type { ApiResponse } from '@/types/common/api.types';

export interface SituationDetailRequest {
  recordingId: number;
}

export interface SituationDetailResult {
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

export type SituationDetailResponse = ApiResponse<SituationDetailResult>;
