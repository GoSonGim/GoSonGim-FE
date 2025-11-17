// 상황극 단일 항목
export interface Situation {
  situationId: number;
  situationName: string;
}

// 상황극 상세 정보
export interface SituationDetail {
  situationId: number;
  situationName: string;
  description: string;
  image: string;
}
