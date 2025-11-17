import axios from 'axios';
import type { KitEvaluationRequest } from '@/types/talkingkit/kit';
import { logger } from '@/utils/common/loggerUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * 키트 평가 결과 제출
 */
export const submitKitEvaluation = async (data: KitEvaluationRequest, audioFile: File): Promise<void> => {
  const formData = new FormData();

  formData.append('kitStageId', data.kitStageId.toString());
  formData.append('evaluationScore', data.evaluationScore.toString());
  formData.append('evaluationFeedback', data.evaluationFeedback);
  formData.append('isSuccess', data.isSuccess.toString());
  formData.append('fileKey', data.fileKey);
  formData.append('audioFile', audioFile);

  try {
    await axios.post(`${API_BASE_URL}/api/kit-stage/evaluation`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    logger.error('Failed to submit evaluation:', error);
    throw new Error('평가 결과 제출에 실패했습니다.');
  }
};

