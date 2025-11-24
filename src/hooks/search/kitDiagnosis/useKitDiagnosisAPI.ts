import { useEffect } from 'react';
import { kitAPI } from '@/apis/talkingkit';
import { diagnosisSentence } from '@/mock/talkingkit/soundPosition/kitDiagnosis.mock';
import { logger } from '@/utils/common/loggerUtils';
import type { KitDiagnosisResponse } from '@/types/talkingkit';
import type { DiagnosisStepType } from '@/constants/search/diagnosis';

interface UseKitDiagnosisAPIProps {
  step: DiagnosisStepType;
  audioBlob: Blob | null;
  onSuccess: (result: KitDiagnosisResponse['result']) => void;
}

export const useKitDiagnosisAPI = ({ step, audioBlob, onSuccess }: UseKitDiagnosisAPIProps) => {
  useEffect(() => {
    if (step !== 'loading' || !audioBlob) {
      logger.warn('API 호출 조건 미충족 - step:', step, 'audioBlob:', audioBlob);
      return;
    }

    const callDiagnosisAPI = async () => {
      try {
        // 디버깅: audioBlob 상태 확인
        logger.log('audioBlob 정보:', {
          size: audioBlob.size,
          type: audioBlob.type,
        });

        // 1. Blob을 File로 변환
        const audioFile = new File([audioBlob], 'diagnosis.wav', { type: 'audio/wav' });

        // 디버깅: File 객체 확인
        logger.log('audioFile 정보:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type,
        });

        // 2. FormData 생성
        const formData = new FormData();
        formData.append('targetText', diagnosisSentence);
        formData.append('audioFile', audioFile);

        // 디버깅: FormData 내용 확인
        logger.log('FormData 내용:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            logger.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type });
          } else {
            logger.log(`  ${key}:`, value);
          }
        }

        // 3. API 호출
        logger.log('진단 API 호출 시작...');
        const response = await kitAPI.diagnosisKit(formData);

        // 4. 콘솔 출력
        logger.log('진단 결과:', response);

        // 5. 성공 콜백
        onSuccess(response.result);
      } catch (error) {
        logger.error('진단 API 호출 실패:', error);
        // 에러 발생 시에도 성공 콜백 호출 (에러 처리는 상위에서)
        onSuccess({
          recognizedText: '',
          scores: { accuracy: 0, fluency: 0, completeness: 0, prosody: 0 },
          overallScore: 0,
          recommendedKits: [],
        });
      }
    };

    callDiagnosisAPI();
  }, [step, audioBlob, onSuccess]);
};
