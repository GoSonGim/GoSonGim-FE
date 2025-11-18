// STT 변환 응답
export interface SttResponse {
  success: boolean;
  status: number;
  message: string;
  result: {
    recognizedText: string;
    confidence: number;
  };
}

