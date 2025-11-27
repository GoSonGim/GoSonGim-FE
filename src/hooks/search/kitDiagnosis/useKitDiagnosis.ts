import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitDiagnosisRecording } from './useKitDiagnosisRecording';
import { useKitDiagnosisAPI } from '@/hooks/search/kitDiagnosis/useKitDiagnosisAPI';
import { useKitDiagnosisBookmark } from './useKitDiagnosisBookmark';
import { logger } from '@/utils/common/loggerUtils';
import type { KitDiagnosisResponse } from '@/types/talkingkit';
import type { DiagnosisStepType } from '@/constants/search/diagnosis';

export const useKitDiagnosis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DiagnosisStepType>('start');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<KitDiagnosisResponse['result'] | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 녹음 완료 시 호출
  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlob(blob);
    setStep('loading');
  }, []);

  // 녹음 관련 훅
  const recording = useKitDiagnosisRecording({
    onRecordingComplete: handleRecordingComplete,
  });

  // API 호출 완료 시 호출
  const handleAPISuccess = useCallback((result: KitDiagnosisResponse['result']) => {
    setDiagnosisResult(result);
    // result 화면으로 전환 (약간의 딜레이 후)
    setTimeout(() => {
      setStep('result');
    }, 500);
  }, []);

  // API 호출 관련 훅
  useKitDiagnosisAPI({
    step,
    audioBlob,
    onSuccess: handleAPISuccess,
  });

  // 북마크 관련 훅
  const bookmark = useKitDiagnosisBookmark();

  // 다시 탐색하기
  const handleRetry = () => {
    setStep('start');
    setAudioBlob(null);
    setDiagnosisResult(null);
    bookmark.resetSavedKits();
  };

  // 내 학습 가기
  const handleGoToStudyTalk = () => {
    if (bookmark.savedKits.size === 0) {
      setShowModal(true);
    } else {
      navigate('/home');
      logger.log('내 학습 가기로 라우팅');
      setShowModal(false);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 담지 않고 이동
  const handleConfirmNoSave = () => {
    navigate('/home');
    setShowModal(false);
  };

  return {
    // State
    step,
    diagnosisResult,
    showModal,

    // Recording
    isRecording: recording.isRecording,
    progress: recording.progress,
    handleStartRecording: recording.handleStartRecording,
    handleStopRecording: recording.handleStopRecording,

    // Bookmark
    savedKits: bookmark.savedKits,
    handleToggleSaveKit: bookmark.handleToggleSaveKit,
    handleSaveAll: () => bookmark.handleSaveAll(diagnosisResult),

    // Actions
    handleRetry,
    handleGoToStudyTalk,
    handleCloseModal,
    handleConfirmNoSave,
  };
};
