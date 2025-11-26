import { useState, useRef, useCallback } from 'react';
import { audioBufferToWav } from '@/utils/common/audioUtils';
import { logger } from '@/utils/common/loggerUtils';
import {
  createAudioContext,
  getUserMedia,
  getSupportedAudioMimeType,
  isMediaRecorderSupported,
  isIOS,
  isSafari,
} from '@/utils/common/browserCompatibilityUtils';

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

      // 마이크 권한 요청 (webkit 호환)
      const stream = await getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;

      // MediaRecorder 지원 확인
      if (!isMediaRecorderSupported()) {
        throw new Error('MediaRecorder not supported');
      }

      // 브라우저에서 지원하는 mimeType 자동 감지
      const mimeType = getSupportedAudioMimeType();

      // MediaRecorder 생성
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined, // 빈 문자열이면 기본값 사용
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

          // Device/Browser 정보 로깅
          logger.log('Device info:', { isIOS: isIOS(), isSafari: isSafari() });

          // 실제 사용된 mimeType 가져오기
          const actualMimeType = mediaRecorder.mimeType || getSupportedAudioMimeType();
          logger.log('Recording mimeType:', actualMimeType);

          // Blob 생성
          const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
          logger.log('Audio blob:', { size: audioBlob.size, type: audioBlob.type });

          // Blob 검증
          if (audioBlob.size === 0) {
            throw new Error('녹음된 오디오가 비어있습니다.');
          }
          if (audioBlob.size < 100) {
            throw new Error(`녹음된 오디오가 너무 작습니다 (${audioBlob.size} bytes)`);
          }

          // AudioContext로 디코딩 (webkit 호환)
          // Note: sampleRate를 지정하지 않고 네이티브 샘플레이트로 디코딩
          // audioBufferToWav()에서 16000 Hz로 리샘플링 처리
          const audioContext = createAudioContext();
          audioContextRef.current = audioContext;

          logger.log('AudioContext:', {
            sampleRate: audioContext.sampleRate,
            state: audioContext.state,
          });

          const arrayBuffer = await audioBlob.arrayBuffer();

          let audioBuffer: AudioBuffer;
          try {
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            logger.log('Decoded audio:', {
              duration: audioBuffer.duration,
              sampleRate: audioBuffer.sampleRate,
              channels: audioBuffer.numberOfChannels,
            });
          } catch (decodeError) {
            logger.error('decodeAudioData failed:', {
              errorName: decodeError instanceof Error ? decodeError.name : 'unknown',
              errorMessage: decodeError instanceof Error ? decodeError.message : String(decodeError),
              blobSize: audioBlob.size,
              blobType: audioBlob.type,
              isIOS: isIOS(),
            });
            throw decodeError;
          }

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