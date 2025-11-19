import { useRef, useState } from 'react';
import { useChromaKey } from '@/hooks/freetalk/useChromaKey';

interface AvatarVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isSessionReady: boolean;
  avatarState: string;
  avatarError: string | null;
  onStartSession?: () => void;
  backgroundImageUrl?: string;
}

/**
 * HeyGen 아바타 비디오 컴포넌트 (크로마키 처리 포함)
 */
export const AvatarVideo = ({
  videoRef,
  isSessionReady,
  avatarState,
  avatarError,
  onStartSession,
  backgroundImageUrl = '/images/avatarBackground.svg',
}: AvatarVideoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarting, setIsStarting] = useState(false);

  // 크로마키 처리
  useChromaKey({
    videoRef,
    canvasRef,
    isSessionReady,
    backgroundImageUrl,
  });

  // 아바타 시작 핸들러
  const handleStart = async () => {
    if (!onStartSession) return;
    setIsStarting(true);
    try {
      await onStartSession();
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="relative box-border flex h-[280px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-black">
      {/* 원본 비디오 (숨김 - 크로마키 처리용) */}
      <video ref={videoRef} autoPlay playsInline className="hidden" />

      {/* 크로마키 처리된 캔버스 */}
      <canvas ref={canvasRef} className="relative z-10 h-full w-full object-cover" />

      {/* 로딩 오버레이 */}
      {!isSessionReady && avatarState === 'loading' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/90">
          <div className="border-blue-1 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-body-01-medium text-center text-gray-100">아바타 준비 중...</p>
        </div>
      )}

      {/* 에러 오버레이 */}
      {avatarState === 'error' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/90">
          <p className="text-body-01-medium text-center text-red-500">{avatarError || '아바타 연결 실패'}</p>
          {onStartSession && (
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="bg-blue-1 text-body-01-semibold flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isStarting ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
                  <span>연결 중...</span>
                </>
              ) : (
                '재시도'
              )}
            </button>
          )}
        </div>
      )}

      {/* 시작 버튼 오버레이 */}
      {!isSessionReady && avatarState === 'idle' && onStartSession && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90">
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="bg-blue-1 text-body-01-semibold flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isStarting ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
                <span>연결 중...</span>
              </>
            ) : (
              '아바타 시작하기'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
