import { useRef, useState, useEffect } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents, VoiceEmotion, TaskType } from '@heygen/streaming-avatar';
import { heygenAPI } from '@/apis/freetalk';
import type { HeygenAvatarState, UseHeygenAvatarProps, UseHeygenAvatarReturn } from '@/types/freetalk';
import { logger } from '@/utils/common/loggerUtils';

export const useHeygenAvatar = ({
  avatarId = 'default',
  voiceId,
  language,
  knowledgeBase,
  callbacks,
}: UseHeygenAvatarProps = {}): UseHeygenAvatarReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarInstanceRef = useRef<StreamingAvatar | null>(null);

  const [avatarState, setAvatarState] = useState<HeygenAvatarState>('idle');
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 세션 시작
  const startSession = async () => {
    try {
      setAvatarState('loading');
      setError(null);

      // 세션 토큰 발급
      const token = await heygenAPI.createSessionToken();

      // StreamingAvatar 인스턴스 생성
      const avatar = new StreamingAvatar({ token });
      avatarInstanceRef.current = avatar;

      // 이벤트 리스너 등록
      avatar.on(StreamingEvents.STREAM_READY, (event: { detail: MediaStream }) => {
        logger.log('Stream ready:', event);

        if (videoRef.current && event.detail) {
          videoRef.current.srcObject = event.detail;
          videoRef.current.play().catch((err) => {
            logger.error('Video play failed:', err);
          });
          callbacks?.onStreamReady?.(event.detail);
        }
        setIsSessionReady(true);
        setAvatarState('idle');
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        logger.log('Stream disconnected');
        setIsSessionReady(false);
        setAvatarState('idle');
      });

      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        logger.log('Avatar started talking');
        setAvatarState('speaking');
        callbacks?.onAvatarStartTalking?.();
      });

      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        logger.log('Avatar stopped talking');
        setAvatarState('idle');
        callbacks?.onAvatarStopTalking?.();
      });

      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (message: { detail: { message: string } }) => {
        logger.log('Avatar message:', message);
        callbacks?.onAvatarMessage?.(message.detail?.message || '');
      });

      avatar.on(StreamingEvents.USER_START, () => {
        logger.log('User started talking');
        setAvatarState('listening');
        callbacks?.onUserStart?.();
      });

      avatar.on(StreamingEvents.USER_STOP, () => {
        logger.log('User stopped talking');
        callbacks?.onUserStop?.();
      });

      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (message: { detail: { message: string } }) => {
        logger.log('User message:', message);
        callbacks?.onUserMessage?.(message.detail?.message || '');
      });

      avatar.on(StreamingEvents.USER_SILENCE, () => {
        logger.log('User is silent');
        callbacks?.onUserSilence?.();
      });

      // 아바타 세션 시작
      const sessionConfig: {
        quality: typeof AvatarQuality.High;
        avatarName: string;
        voice?: {
          voiceId: string;
          rate?: number;
          emotion?: typeof VoiceEmotion.FRIENDLY;
        };
        language?: string;
        knowledgeBase?: string;
        setSettings?: {
          stt: {
            provider: string;
            language: string;
            model: string;
            punctuation: boolean;
          };
        };
      } = {
        quality: AvatarQuality.High,
        avatarName: avatarId,
      };

      // voice 설정 추가 (선택적)
      if (voiceId) {
        sessionConfig.voice = {
          voiceId: voiceId,
          rate: 1.0,
        };
      }

      // language 추가 (선택적)
      if (language) {
        sessionConfig.language = language;
      }

      // knowledgeBase 추가 (선택적)
      if (knowledgeBase) {
        sessionConfig.knowledgeBase = knowledgeBase;
      }

      // STT 설정을 sessionConfig에 추가
      sessionConfig.setSettings = {
        stt: {
          provider: 'deepgram',
          language: language || 'ko',
          model: 'nova-2-general',
          punctuation: true,
        },
      };

      // STT 설정 적용 (세션 시작 시 한 번만)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const avatarWithSettings = avatar as any;
      if ('setSettings' in avatar && typeof avatarWithSettings.setSettings === 'function') {
        try {
          const sttPayload = sessionConfig.setSettings;
          logger.log('[SESSION START] Applying STT settings via setSettings:', sttPayload);
          await avatarWithSettings.setSettings(sttPayload);
          logger.log('[SESSION START] STT settings applied successfully');
        } catch (settingsError) {
          logger.warn('[SESSION START] Failed to apply STT settings:', settingsError);
          // STT 설정 실패해도 세션은 계속 진행
        }
      }

      logger.log('Creating avatar session with config:', sessionConfig);
      await avatar.createStartAvatar(sessionConfig);

      logger.log('Avatar session started successfully');
    } catch (err) {
      logger.error('Failed to start avatar session:', err);
      let errorMessage = '아바타 세션 시작 실패';

      if (err instanceof Error) {
        errorMessage = err.message;

        if (errorMessage.includes('400')) {
          errorMessage = `아바타 세션 생성 실패 (400 Bad Request)

가능한 원인:
1. 세션 토큰이 만료되었거나 유효하지 않음
2. avatarName이 잘못되었음 (기본값: 'default')
3. HeyGen 계정에 크레딧이 부족함
4. API 설정이 올바르지 않음

콘솔 로그를 확인하여 자세한 정보를 확인하세요.`;
        }
      }

      setError(errorMessage);
      setAvatarState('error');
      callbacks?.onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  // 세션 종료
  const endSession = async () => {
    try {
      if (avatarInstanceRef.current) {
        await avatarInstanceRef.current.stopAvatar();
        avatarInstanceRef.current = null;
      }
      setIsSessionReady(false);
      setAvatarState('idle');
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      logger.error('Failed to end avatar session:', err);
    }
  };

  // 음성 듣기 시작 (Voice Chat 모드)
  const startListening = async (options?: { isInputAudioMuted?: boolean }) => {
    try {
      if (!avatarInstanceRef.current || !isSessionReady) {
        throw new Error('아바타 세션이 준비되지 않았습니다.');
      }
      await avatarInstanceRef.current.startVoiceChat(options || {});
      logger.log('Voice chat started');
    } catch (err) {
      logger.error('Failed to start listening:', err);
      setError(err instanceof Error ? err.message : '음성 인식 시작 실패');
    }
  };

  // 음성 듣기 중단
  const stopListening = async () => {
    try {
      if (!avatarInstanceRef.current) {
        return;
      }
      await avatarInstanceRef.current.closeVoiceChat();
      logger.log('Voice chat stopped');
    } catch (err) {
      logger.error('Failed to stop listening:', err);
    }
  };

  // 아바타가 말하기 (TALK 모드)
  const speak = async (text: string) => {
    try {
      if (!avatarInstanceRef.current || !isSessionReady) {
        throw new Error('아바타 세션이 준비되지 않았습니다.');
      }

      await avatarInstanceRef.current.speak({
        text: text,
        task_type: TaskType.TALK,
      });

      logger.log('Avatar speaking:', text);
    } catch (err) {
      logger.error('Failed to speak:', err);
      setError(err instanceof Error ? err.message : '아바타 말하기 실패');
    }
  };

  // 마이크 음소거 제어
  const setMicrophoneMuted = async (muted: boolean) => {
    try {
      if (!avatarInstanceRef.current || !isSessionReady) {
        throw new Error('아바타 세션이 준비되지 않았습니다.');
      }
      await avatarInstanceRef.current.closeVoiceChat();
      await avatarInstanceRef.current.startVoiceChat({ isInputAudioMuted: muted });
      logger.log(`Microphone ${muted ? 'muted' : 'unmuted'}`);
    } catch (err) {
      logger.error('Failed to set microphone mute:', err);
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (avatarInstanceRef.current) {
        avatarInstanceRef.current.stopAvatar().catch(logger.error);
      }
    };
  }, []);

  return {
    videoRef,
    avatarState,
    isSessionReady,
    error,
    startSession,
    endSession,
    startListening,
    stopListening,
    speak,
    setMicrophoneMuted,
  };
};
