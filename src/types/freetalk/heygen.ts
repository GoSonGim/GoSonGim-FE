export type HeygenAvatarState = 'idle' | 'loading' | 'speaking' | 'listening' | 'error';

export interface HeygenEventCallbacks {
  onStreamReady?: (stream: MediaStream) => void;
  onAvatarStartTalking?: () => void;
  onAvatarStopTalking?: () => void;
  onAvatarMessage?: (message: string) => void;
  onUserStart?: () => void;
  onUserStop?: () => void;
  onUserMessage?: (message: string) => void;
  onUserSilence?: () => void;
  onError?: (error: Error) => void;
}

export interface UseHeygenAvatarProps {
  avatarId?: string;
  voiceId?: string;
  language?: string;
  knowledgeBase?: string;
  callbacks?: HeygenEventCallbacks;
}

export interface SpeakOptions {
  text: string;
  taskType?: import('@heygen/streaming-avatar').TaskType;
}

export interface UseHeygenAvatarReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  avatarState: HeygenAvatarState;
  isSessionReady: boolean;
  error: string | null;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  startListening: (options?: { isInputAudioMuted?: boolean }) => Promise<void>;
  stopListening: () => Promise<void>;
  speak: (options: SpeakOptions) => Promise<void>;
  setMicrophoneMuted: (muted: boolean) => Promise<void>;
}

