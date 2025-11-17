import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';
import Mike1 from '@/assets/svgs/home/mike1.svg';
import Mike2 from '@/assets/svgs/home/mike2.svg';
import GrayCircle from '@/assets/svgs/home/talkbanned.svg';
import LoadingDot from '@/assets/svgs/home/loadingdot.svg';
// 배경 이미지는 public 폴더에서 로드
import { useTypingAnimation } from '@/hooks/freetalk/useTypingAnimation';
import { useFreeTalkConversation } from '@/hooks/freetalk/useFreeTalkConversation';
import clsx from 'clsx';

export default function FreeTalk() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 대화 관리 훅 (아바타 포함)
  const conversation = useFreeTalkConversation();

  // 현재 질문 및 타이핑 애니메이션
  const currentQuestion = conversation.activeConversation?.question || '';
  const { displayedText, isComplete } = useTypingAnimation(currentQuestion, 30);

  // 버튼 상태 및 conversations 디버깅
  useEffect(() => {
    console.log('[DEBUG] 🎯 상태 체크:');
    console.log('[DEBUG] - conversations:', conversation.conversations.length, '개');
    console.log(
      '[DEBUG] - conversations 상세:',
      conversation.conversations
        .map((c) => `ID${c.id}:${c.status}(Q:${c.question?.substring(0, 20)}..., A:${c.answer?.substring(0, 20)}...)`)
        .join(' | '),
    );
    console.log('[DEBUG] - activeConversation:', conversation.activeConversation ? 'O' : 'X');
    if (conversation.activeConversation) {
      console.log('[DEBUG]   → ID:', conversation.activeConversation.id);
      console.log('[DEBUG]   → question:', conversation.activeConversation.question);
    }
    console.log('[DEBUG] - isSessionReady:', conversation.isSessionReady ? 'O' : 'X');
    console.log('[DEBUG] - isComplete:', isComplete ? 'O' : 'X');
    console.log('[DEBUG] - isRecording:', conversation.isRecording ? 'O' : 'X');
    console.log('[DEBUG] - showLoadingDots:', conversation.showLoadingDots ? 'O' : 'X');
    console.log(
      '[DEBUG] ➡️ 버튼 활성화:',
      conversation.activeConversation && conversation.isSessionReady && isComplete && !conversation.showLoadingDots
        ? '✅ YES'
        : '❌ NO',
    );
  }, [
    conversation.conversations,
    conversation.activeConversation,
    conversation.isSessionReady,
    isComplete,
    conversation.isRecording,
    conversation.showLoadingDots,
  ]);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation.conversations, displayedText, conversation.showLoadingDots]);

  // 크로마키 배경 처리
  useEffect(() => {
    const video = conversation.videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !conversation.isSessionReady) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Canvas 크기를 video와 동일하게 설정
    const updateCanvasSize = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    video.addEventListener('loadedmetadata', updateCanvasSize);
    updateCanvasSize();

    // 배경 이미지 로드 (public 폴더에서)
    const bgImage = new Image();
    bgImage.src = '/images/freetalk-background.svg';

    let animationId: number;

    const processFrame = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA && !video.paused && !video.ended) {
        // 배경 이미지 먼저 그리기
        if (bgImage.complete) {
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        }

        // 임시 캔버스에 비디오 그리기
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 픽셀 데이터 가져오기
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 크로마키 처리 (녹색 제거)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 녹색 범위 판단 (조정 가능)
          if (g > 100 && g > r * 1.5 && g > b * 1.5) {
            data[i + 3] = 0; // 투명하게
          }
        }

        // 배경 이미지 다시 그리기
        if (bgImage.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        }

        // 처리된 비디오 그리기
        ctx.putImageData(imageData, 0, 0);
      }

      animationId = requestAnimationFrame(processFrame);
    };

    const startProcessing = () => {
      if (bgImage.complete) {
        processFrame();
      }
    };

    bgImage.onload = startProcessing;
    if (bgImage.complete) {
      startProcessing();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      video.removeEventListener('loadedmetadata', updateCanvasSize);
    };
  }, [conversation.isSessionReady, conversation.videoRef]);

  const handleExit = async () => {
    // 종료하기 버튼: 5번째 대화 완료 전에는 세션 종료하지 않고 페이지만 이동
    const completedCount = conversation.conversations.filter((c) => c.status === 'completed').length;

    if (completedCount < 5) {
      console.log('[EXIT] 5번째 대화 전 - 세션 유지하고 페이지만 이동');
      navigate('/');
      return;
    }

    // 5번째 대화 완료 후에만 세션 종료
    try {
      console.log('[EXIT] 5번째 대화 완료 - 세션 종료 후 이동');
      if (conversation.isSessionReady) {
        await conversation.endSession();
      }
    } finally {
      navigate('/');
    }
  };

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시에도 5번째 대화 완료 후에만 종료
      const completedCount = conversation.conversations.filter((c) => c.status === 'completed').length;

      if (completedCount >= 5 && conversation.isSessionReady) {
        console.log('[UNMOUNT] 5번째 대화 완료 - 세션 종료');
        conversation.endSession().catch(() => {});
      } else {
        console.log('[UNMOUNT] 5번째 대화 전 - 세션 유지');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      <div className="relative flex h-16 shrink-0 items-center justify-between overflow-clip bg-white px-4 py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex size-12 cursor-pointer items-center justify-center p-2"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[10px]" />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-center text-[20px] leading-normal font-normal text-gray-100">
          자유대화
        </p>
        <button
          onClick={handleExit}
          className="text-gray-80 cursor-pointer rounded-lg px-1 py-2 text-[18px] leading-normal font-normal transition-colors hover:bg-[#f1f1f5]"
        >
          종료하기
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 gap-2 px-4 pt-6 pb-4">
          {[1, 2, 3, 4, 5].map((num) => {
            const conv = conversation.conversations.find((c) => c.id === num);
            const status = conv?.status || 'pending';
            const isActive = conversation.activeConversation?.id === num;

            return (
              <div
                key={num}
                className={clsx(
                  'flex h-[30px] items-center justify-center rounded-[8px] text-[16px] leading-normal font-normal',
                  status === 'completed' && 'text-gray-40 w-[70px] bg-[#757a9e]',
                  isActive && 'w-[70px] border border-solid border-[#757a9e] bg-white text-[#757a9e]',
                  status === 'pending' && 'bg-gray-20 w-[70px] text-[#232323]',
                )}
              >
                {status === 'completed' ? '완료' : `대화 ${num}`}
              </div>
            );
          })}
        </div>

        <div className="shrink-0 px-4 pb-6">
          <div className="relative box-border flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-black">
            {/* 원본 비디오 (숨김 - 크로마키 처리용) */}
            <video ref={conversation.videoRef} autoPlay playsInline className="hidden" />

            {/* 크로마키 처리된 캔버스 */}
            <canvas ref={canvasRef} className="relative z-10 h-full w-full object-cover" />

            {/* 로딩 오버레이 */}
            {!conversation.isSessionReady && conversation.avatarState === 'loading' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90">
                <p className="text-center text-[18px] leading-normal font-medium text-gray-100">아바타 준비 중...</p>
              </div>
            )}

            {/* 에러 오버레이 */}
            {conversation.avatarState === 'error' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/90">
                <p className="text-center text-[16px] leading-normal font-medium text-red-500">
                  {conversation.avatarError || '아바타 연결 실패'}
                </p>
                <button
                  onClick={() => conversation.startSession()}
                  className="rounded-lg bg-[#757a9e] px-4 py-2 text-[14px] text-white"
                >
                  재시도
                </button>
              </div>
            )}

            {/* 시작 버튼 오버레이 */}
            {!conversation.isSessionReady && conversation.avatarState === 'idle' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90">
                <button
                  onClick={() => conversation.startSession()}
                  className="rounded-lg bg-[#757a9e] px-4 py-2 text-[16px] text-white"
                >
                  아바타 시작하기
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="hide-scrollbar flex-1 overflow-y-auto px-4">
          {/* 완료된 대화만 표시 */}
          {conversation.conversations
            .filter((conv) => conv.status === 'completed')
            .map((conv) => (
              <div key={conv.id} className="mb-6 flex flex-col gap-4">
                {/* 질문 박스 */}
                <div className="flex justify-start">
                  <div className="flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[2px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] bg-[#757a9e] px-[16px] py-[16px]">
                    <p className="text-center text-[20px] leading-normal font-normal wrap-break-word whitespace-pre-wrap text-white">
                      {conv.question}
                    </p>
                  </div>
                </div>

                {/* 답변 박스 (완료된 답변만) */}
                {conv.answer && (
                  <div className="flex justify-end">
                    <div className="border-gray-20 flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid bg-white px-[16px] py-[16px]">
                      <p className="text-gray-80 text-center text-[20px] leading-normal font-normal wrap-break-word whitespace-pre-wrap">
                        {conv.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* 현재 진행 중인 대화 (active) */}
          {conversation.activeConversation && (
            <div className="mb-6 flex flex-col gap-4">
              {/* 아바타 질문 (타이핑 효과) */}
              <div className="flex justify-start">
                <div className="flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[2px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] bg-[#757a9e] px-[16px] py-[16px]">
                  <p className="text-center text-[20px] leading-normal font-normal wrap-break-word whitespace-pre-wrap text-white">
                    {displayedText}
                  </p>
                </div>
              </div>

              {/* 사용자 답변 (답변 박스가 미리 생성되었거나 로딩 중일 때 표시) */}
              {conversation.activeConversation?.answer !== undefined && (
                <div className="flex justify-end">
                  {conversation.showLoadingDots ? (
                    // 로딩 중 (아바타 응답 대기) - active conversation이 있을 때만
                    <div className="border-gray-20 flex h-[62px] w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid bg-white px-[16px] py-[16px]">
                      <LoadingDot className="h-[30px] w-[68px] animate-pulse" />
                    </div>
                  ) : (
                    // 답변 박스 (녹음 중에는 빈 박스, 완료 시 최종 답변 표시)
                    <div className="border-gray-20 flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid bg-white px-[16px] py-[16px]">
                      <p className="text-gray-80 text-center text-[20px] leading-normal font-normal wrap-break-word whitespace-pre-wrap">
                        {conversation.activeConversation.answer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 justify-center py-3">
        {conversation.isRecording ? (
          // 녹음 중: 정적 회색 원 표시 (자동 종료 대기)
          <button
            onClick={conversation.handleMicClick}
            className="flex size-[88px] cursor-default items-center justify-center"
            aria-label="녹음 중 (자동 종료 대기)"
          >
            <GrayCircle className="size-[88px]" />
          </button>
        ) : (
          // 녹음 대기: 마이크 버튼
          <button
            onClick={conversation.handleMicClick}
            disabled={
              !conversation.activeConversation ||
              !conversation.isSessionReady ||
              !isComplete ||
              conversation.showLoadingDots
            }
            className={clsx(
              'flex size-[88px] cursor-pointer items-center justify-center',
              (!conversation.activeConversation ||
                !conversation.isSessionReady ||
                !isComplete ||
                conversation.showLoadingDots) &&
                'cursor-not-allowed opacity-100',
            )}
            aria-label="녹음하기"
          >
            {!conversation.activeConversation ||
            !conversation.isSessionReady ||
            !isComplete ||
            conversation.showLoadingDots ? (
              <Mike1 className="size-[88px]" />
            ) : (
              <Mike2 className="size-[88px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
