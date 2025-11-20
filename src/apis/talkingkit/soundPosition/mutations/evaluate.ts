import { apiClient } from '@/apis/client';
import type { LipSoundEvaluationRequest, LipSoundEvaluationResponse } from '@/types/talkingkit/soundPosition';

/**
 * 발음 평가 요청
 * POST 메서드로 배열 형태의 payload 전달
 */
export const evaluatePronunciation = async (
  payload: LipSoundEvaluationRequest,
): Promise<LipSoundEvaluationResponse> => {
  // POST 메서드로 body에 배열 전달
  const response = await apiClient.post<LipSoundEvaluationResponse>(
    '/api/v1/kits/stages/evaluate',
    payload, // Request Body
    { timeout: 30000 },
  );
  return response.data;
};
