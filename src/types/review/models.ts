export interface Word {
  text: string;
}

export interface QuizWord {
  id: number;
  text: string;
  category: string;
}

export interface SituationReviewItem {
  situationId: number;
  situationName: string;
  situationCategory: string;
  recordingId: number;
  createdAt: string;
}

export interface KitReviewItem {
  kitId: number;
  kitName: string;
  kitCategory: string;
  recordingId: number;
  createdAt: string;
}
