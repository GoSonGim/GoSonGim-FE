import type { ApiResponse } from '@/types/common/api.types';
import type { LipSoundIndividualResult, LipSoundOverallResult } from '@/types/search/lipsound';

// Request
export interface WordEvaluationRequestItem {
  kitStageId: number;
  fileKey: string;
  targetWord: string;
}

export type WordEvaluationRequest = WordEvaluationRequestItem[];

// Response (조음 키트와 동일한 구조)
export interface WordEvaluationResponse
  extends ApiResponse<{
    individualResults: LipSoundIndividualResult[];
    overallResult?: LipSoundOverallResult;
  }> {}
