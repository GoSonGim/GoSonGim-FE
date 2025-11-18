import { useState, useCallback, useRef } from 'react';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { logger } from '@/utils/common/loggerUtils';

interface PracticeRecording {
  attemptNumber: number;
  audioBlob: Blob;
  timestamp: number;
}

interface UseSituationPracticeProps {
  onPracticeComplete?: () => void;
}

interface UseSituationPracticeReturn {
  // 상태
  sentence: string;
  practiceCount: number;
  recordings: PracticeRecording[];
  isRecording: boolean;
  isSpeaking: boolean;
  maxPracticeCount: number;
  
  // 액션
  setSentence: (sentence: string) => void;
  speakSentence: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
}

/**
 * 상황극 문장 연습 훅
 * - 문장 작성
 * - TTS로 문장 듣기 (Web Speech API)
 * - 3회 녹음 연습
 */
export const useSituationPractice = ({
  onPracticeComplete,
}: UseSituationPracticeProps = {}): UseSituationPracticeReturn => {
  const maxPracticeCount = 3;
  
  // 상태
  const [sentence, setSentence] = useState('');
  const [practiceCount, setPracticeCount] = useState(0);
  const [recordings, setRecordings] = useState<PracticeRecording[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // 오디오 녹음
  const audioRecorder = useAudioRecorder();

  /**
   * TTS로 문장 읽기 (Web Speech API)
   */
  const speakSentence = useCallback(() => {
    if (!sentence || sentence.trim() === '') {
      logger.warn('[PRACTICE] 문장이 비어있습니다');
      return;
    }

    if (isSpeaking) {
      logger.warn('[PRACTICE] 이미 재생 중입니다');
      return;
    }

    try {
      // Web Speech API 초기화
      if (!synthRef.current) {
        synthRef.current = window.speechSynthesis;
      }

      // 기존 재생 중지
      synthRef.current.cancel();

      // SpeechSynthesisUtterance 생성
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9; // 속도 (0.1 ~ 10)
      utterance.pitch = 1.0; // 음높이 (0 ~ 2)
      utterance.volume = 1.0; // 볼륨 (0 ~ 1)

      utterance.onstart = () => {
        logger.log('[PRACTICE] TTS 재생 시작');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        logger.log('[PRACTICE] TTS 재생 완료');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        logger.error('[PRACTICE] TTS 에러:', event);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      
      logger.log('[PRACTICE] TTS 재생 요청', { sentence });
    } catch (error) {
      logger.error('[PRACTICE] TTS 실패:', error);
      setIsSpeaking(false);
    }
  }, [sentence, isSpeaking]);

  /**
   * 녹음 시작
   */
  const startRecording = useCallback(async () => {
    if (practiceCount >= maxPracticeCount) {
      logger.warn('[PRACTICE] 최대 연습 횟수 도달');
      return;
    }

    if (isSpeaking) {
      logger.warn('[PRACTICE] TTS 재생 중에는 녹음할 수 없습니다');
      return;
    }

    try {
      logger.log('[PRACTICE] 녹음 시작', { attempt: practiceCount + 1 });
      await audioRecorder.startRecording();
    } catch (error) {
      logger.error('[PRACTICE] 녹음 시작 실패:', error);
      throw error;
    }
  }, [practiceCount, isSpeaking, audioRecorder, maxPracticeCount]);

  /**
   * 녹음 중지 및 저장
   */
  const stopRecording = useCallback(async () => {
    try {
      logger.log('[PRACTICE] 녹음 중지');
      
      const audioBlob = await audioRecorder.stopRecording();
      if (!audioBlob) {
        throw new Error('녹음 데이터가 없습니다');
      }

      const newRecording: PracticeRecording = {
        attemptNumber: practiceCount + 1,
        audioBlob,
        timestamp: Date.now(),
      };

      setRecordings((prev) => [...prev, newRecording]);
      setPracticeCount((prev) => prev + 1);

      logger.log('[PRACTICE] 녹음 저장 완료', {
        attemptNumber: practiceCount + 1,
        size: audioBlob.size,
      });

      // 3회 완료 시 콜백 호출
      if (practiceCount + 1 >= maxPracticeCount) {
        logger.log('[PRACTICE] 연습 완료 (3회)');
        if (onPracticeComplete) {
          onPracticeComplete();
        }
      }
    } catch (error) {
      logger.error('[PRACTICE] 녹음 저장 실패:', error);
      throw error;
    }
  }, [practiceCount, audioRecorder, onPracticeComplete, maxPracticeCount]);

  /**
   * 초기화
   */
  const reset = useCallback(() => {
    logger.log('[PRACTICE] 연습 초기화');
    
    // TTS 중지
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    setSentence('');
    setPracticeCount(0);
    setRecordings([]);
    setIsSpeaking(false);
  }, []);

  return {
    // 상태
    sentence,
    practiceCount,
    recordings,
    isRecording: audioRecorder.isRecording,
    isSpeaking,
    maxPracticeCount,
    
    // 액션
    setSentence,
    speakSentence,
    startRecording,
    stopRecording,
    reset,
  };
};

