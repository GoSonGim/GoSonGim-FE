import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';
import Mike1 from '@/assets/svgs/home/mike1.svg';
import Mike2 from '@/assets/svgs/home/mike2.svg';
import WhiteSquare from '@/assets/svgs/home/whitesquare.svg';
import BlueCircle from '@/assets/svgs/home/bluecircle.svg';
import LoadingDot from '@/assets/svgs/home/loadingdot.svg';
import CircularProgress from '@/components/freetalk/CircularProgress';
import { conversationsMock, mockAnswers, type Conversation } from '@/mock/freetalk/freeTalk.mock';
import { useTypingAnimation } from '@/hooks/freetalk/useTypingAnimation';
import clsx from 'clsx';

export default function FreeTalk() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>(conversationsMock);
  const [isRecording, setIsRecording] = useState(false);
  const [showLoadingDots, setShowLoadingDots] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // 현재 활성 대화 찾기
  const activeConversation = conversations.find((conv) => conv.status === 'active');
  const currentQuestion = activeConversation?.question || '';

  // 타이핑 애니메이션
  const { displayedText, isComplete } = useTypingAnimation(currentQuestion, 50);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversations, displayedText, showLoadingDots, userAnswer]);

  // 프로그레스 업데이트
  useEffect(() => {
    if (isRecording) {
      setProgress(0);
      const duration = 3000; // 3초
      const interval = 50; // 50ms마다 업데이트
      const increment = (100 / duration) * interval;

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return 100;
          }
          return next;
        });
      }, interval);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    } else {
      setProgress(0);
    }
  }, [isRecording]);

  // 마이크 클릭 핸들러 (녹음 시작)
  const handleMicClick = () => {
    if (!activeConversation || isRecording || !isComplete) return;

    setIsRecording(true);
    setShowLoadingDots(true);
    setUserAnswer(null);

    // 3초 후 답변 표시 및 다음 대화로 이동
    loadingTimerRef.current = setTimeout(() => {
      const answer = mockAnswers[activeConversation.id];
      setUserAnswer(answer);
      setShowLoadingDots(false);

      // 답변 표시 후 잠시 대기 후 다음 대화로 이동
      completeTimerRef.current = setTimeout(() => {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === activeConversation.id) {
              // 현재 대화를 완료로 변경하고 답변 추가
              return {
                ...conv,
                status: 'completed' as const,
                answer: answer,
              };
            }
            // 다음 대화를 활성으로 변경
            if (conv.id === activeConversation.id + 1) {
              return { ...conv, status: 'active' as const };
            }
            return conv;
          }),
        );
        setIsRecording(false);
        setUserAnswer(null);
        loadingTimerRef.current = null;
        completeTimerRef.current = null;
      }, 1000);
    }, 3000);
  };

  // 녹음 중단 핸들러
  const handleStopRecording = () => {
    if (!activeConversation || !isRecording) return;

    // 타이머 취소
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    const answer = userAnswer || mockAnswers[activeConversation.id];

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            status: 'completed' as const,
            answer: answer,
          };
        }
        if (conv.id === activeConversation.id + 1) {
          return { ...conv, status: 'active' as const };
        }
        return conv;
      }),
    );

    setIsRecording(false);
    setShowLoadingDots(false);
    setUserAnswer(null);
  };

  const handleExit = () => {
    navigate('/');
  };

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
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={clsx(
                'flex h-[30px] items-center justify-center rounded-[8px] text-[16px] leading-normal font-normal',
                conv.status === 'completed' && 'text-gray-40 w-[70px] bg-[#757a9e]',
                conv.status === 'active' && 'w-[70px] border border-solid border-[#757a9e] bg-white text-[#757a9e]',
                conv.status === 'pending' && 'bg-gray-20 w-[70px] text-[#232323]',
              )}
            >
              {conv.status === 'completed' ? '완료' : `대화 ${conv.id}`}
            </div>
          ))}
        </div>

        <div className="shrink-0 px-4 pb-6">
          <div className="box-border flex h-[224px] w-full items-center justify-center rounded-[16px] bg-white">
            <p className="text-center text-[18px] leading-normal font-medium text-gray-100">아바타 영상</p>
          </div>
        </div>

        <div ref={scrollRef} className="hide-scrollbar flex-1 overflow-y-auto px-4">
          {conversations
            .filter((conv) => conv.status === 'completed')
            .map((conv) => (
              <div key={conv.id} className="mb-6 flex flex-col gap-4">
                <div className="flex justify-start">
                  <div className="flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[2px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] bg-[#757a9e] px-[16px] py-[16px]">
                    <p className="text-center text-[20px] leading-normal font-normal wrap-break-word text-white">
                      {conv.question}
                    </p>
                  </div>
                </div>

                {conv.answer && (
                  <div className="flex justify-end">
                    <div className="border-gray-20 flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid bg-white px-[16px] py-[16px]">
                      <p className="text-gray-80 text-center text-[20px] leading-normal font-normal wrap-break-word">
                        {conv.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {activeConversation && (
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex justify-start">
                <div className="flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[2px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] bg-[#757a9e] px-[16px] py-[16px]">
                  <p className="text-center text-[20px] leading-normal font-normal wrap-break-word text-white">
                    {displayedText}
                  </p>
                </div>
              </div>

              {(showLoadingDots || userAnswer) && (
                <div className="flex justify-end">
                  {showLoadingDots ? (
                    <div className="border-gray-20 flex h-[62px] w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid bg-white px-[16px] py-[16px]">
                      <LoadingDot className="h-[30px] w-[68px] animate-pulse" />
                    </div>
                  ) : userAnswer ? (
                    <div className="border-gray-20 flex min-h-[62px] w-[361px] items-center justify-center rounded-tl-[16px] rounded-tr-[2px] rounded-br-[16px] rounded-bl-[16px] border border-solid bg-white px-[16px] py-[16px]">
                      <p className="text-gray-80 text-center text-[20px] leading-normal font-normal wrap-break-word">
                        {userAnswer}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 justify-center py-3">
        {isRecording ? (
          <button
            onClick={handleStopRecording}
            className="relative flex size-[88px] cursor-pointer items-center justify-center"
            aria-label="녹음 중단"
          >
            <CircularProgress progress={progress} />
            <BlueCircle className="absolute size-[88px]" />
            <WhiteSquare className="relative size-[26px]" />
          </button>
        ) : (
          <button
            onClick={handleMicClick}
            disabled={!activeConversation || !isComplete}
            className={clsx(
              'flex size-[88px] cursor-pointer items-center justify-center',
              (!activeConversation || !isComplete) && 'cursor-not-allowed opacity-100',
            )}
            aria-label="녹음하기"
          >
            {!isComplete ? <Mike1 className="size-[88px]" /> : <Mike2 className="size-[88px]" />}
          </button>
        )}
      </div>
    </div>
  );
}
