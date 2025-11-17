import { useState, useRef, useCallback } from 'react';
import { audioBufferToWav } from '@/utils/common/audioUtils';
import { logger } from '@/utils/common/loggerUtils';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  error: string | null;
}

/**
 * 오디오 녹음 커스텀 훅
 * MediaRecorder API를 사용하여 오디오를 녹음하고 WAV 형식으로 변환
 */
export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * 녹음 시작
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;

      // MediaRecorder 생성
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm', // 브라우저에서 지원하는 형식
      });

      mediaRecorderRef.current = mediaRecorder;

      // 데이터 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);
      logger.log('녹음 시작');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '마이크 권한이 필요합니다.';
      setError(errorMessage);
      logger.error('녹음 시작 실패:', err);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * 녹음 중지 및 WAV Blob 반환
   */
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        logger.warn('녹음이 진행 중이 아닙니다.');
        resolve(null);
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = async () => {
        try {
          logger.log('녹음 중지, WAV 변환 시작');

          // Blob 생성
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          // AudioContext로 디코딩
          const audioContext = new AudioContext({ sampleRate: 16000 });
          audioContextRef.current = audioContext;

          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // WAV로 변환
          const wavArrayBuffer = audioBufferToWav(audioBuffer, 16000);
          const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

          logger.log('WAV 변환 완료, Blob 크기:', wavBlob.size, 'bytes');

          // 리소스 정리
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }

          setIsRecording(false);
          audioChunksRef.current = [];
          resolve(wavBlob);
        } catch (err) {
          logger.error('WAV 변환 실패:', err);
          setError('오디오 변환 중 오류가 발생했습니다.');
          resolve(null);
        }
      };

      // 녹음 중지
      mediaRecorder.stop();
    });
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
  };
};