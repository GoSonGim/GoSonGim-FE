import { useState, useEffect, useCallback } from 'react';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { DIAGNOSIS_RECORDING } from '@/constants/search/diagnosis';
import { logger } from '@/utils/common/loggerUtils';

interface UseKitDiagnosisRecordingProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const useKitDiagnosisRecording = ({ onRecordingComplete }: UseKitDiagnosisRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const { startRecording: startAudioRecording, stopRecording: stopAudioRecording } = useAudioRecorder();

  // 녹음 완료 처리
  const handleRecordingComplete = useCallback(async () => {
    const blob = await stopAudioRecording();
    if (blob) {
      logger.log('녹음 완료, Blob 크기:', blob.size);
      onRecordingComplete(blob);
    }
  }, [stopAudioRecording, onRecordingComplete]);

  // 8초 녹음 타이머
  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + DIAGNOSIS_RECORDING.INCREMENT;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsRecording(false);
          setProgress(0);
          handleRecordingComplete();
          return 100;
        }
        return newProgress;
      });
    }, DIAGNOSIS_RECORDING.INTERVAL);

    return () => clearInterval(timer);
  }, [isRecording, handleRecordingComplete]);

  const handleStartRecording = async () => {
    try {
      await startAudioRecording();
      setIsRecording(true);
      setProgress(0);
    } catch (error) {
      logger.error('녹음 시작 실패:', error);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setProgress(0);
  };

  return {
    isRecording,
    progress,
    handleStartRecording,
    handleStopRecording,
  };
};
