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

// 상황극 목록 조회 응답
export interface SituationListResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    situations: Situation[];
  };
}

// 상황극 상세 조회 응답
export interface SituationDetailResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: SituationDetail;
}
