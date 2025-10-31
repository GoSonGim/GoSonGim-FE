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
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
          })
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
      })
    );

    setIsRecording(false);
    setShowLoadingDots(false);
    setUserAnswer(null);
  };

  
  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="relative bg-background-primary flex h-full flex-col">
      <div className="bg-white h-16 flex items-center justify-between overflow-clip px-4 py-2 relative shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-2 size-12 cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[10px]" />
        </button>
        <p className="text-[20px] font-normal leading-[1.5] text-gray-100 text-center absolute left-1/2 -translate-x-1/2">
          자유대화
        </p>
        <button
          onClick={handleExit}
          className="text-[18px] font-normal leading-[1.5] text-[#3c434f] px-1 py-2 rounded-lg hover:bg-[#f1f1f5] cursor-pointer transition-colors"
        >
          종료하기
        </button>
      </div>

 
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex gap-2 px-4 pt-6 pb-4 shrink-0">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={clsx(
                'flex items-center justify-center h-[30px] rounded-[8px] text-[16px] font-normal leading-[1.5]',
                conv.status === 'completed' && 'bg-[#757a9e] text-[#a6aeb6] w-[70px]',
                conv.status === 'active' &&
                  'bg-white text-[#757a9e] border border-[#757a9e] border-solid w-[70px]',
                conv.status === 'pending' && 'bg-[#e2e4e7] text-[#a6aeb6] w-[70px]'
              )}
            >
              {conv.status === 'completed' ? '완료' : `대화 ${conv.id}`}
            </div>
          ))}
        </div>

        
        <div className="px-4 pb-6 shrink-0">
          <div className="bg-white box-border flex items-center justify-center h-[224px] rounded-[16px] w-full">
            <p className="text-[18px] font-medium leading-[1.5] text-gray-100 text-center">
              아바타 영상
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 hide-scrollbar">
        
          {conversations
            .filter((conv) => conv.status === 'completed')
            .map((conv) => (
              <div key={conv.id} className="flex flex-col gap-4 mb-6">
           
                <div className="flex justify-start">
                  <div className="bg-[#757a9e] w-[361px] min-h-[62px] px-[16px] py-[16px] rounded-tl-[2px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] flex items-center justify-center">
                    <p className="text-[20px] font-normal leading-[1.5] text-white text-center break-words">
                      {conv.question}
                    </p>
                  </div>
                </div>
               
                {conv.answer && (
                  <div className="flex justify-end">
                    <div className="bg-white border border-[#e2e4e7] border-solid w-[361px] min-h-[62px] px-[16px] py-[16px] rounded-tl-[16px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px] flex items-center justify-center">
                      <p className="text-[20px] font-normal leading-[1.5] text-[#3c434f] text-center break-words">
                        {conv.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

          
          {activeConversation && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-start">
                <div className="bg-[#757a9e] w-[361px] min-h-[62px] px-[16px] py-[16px] rounded-tl-[2px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] flex items-center justify-center">
                  <p className="text-[20px] font-normal leading-[1.5] text-white text-center break-words">
                    {displayedText}
                  </p>
                </div>
              </div>

              {(showLoadingDots || userAnswer) && (
                <div className="flex justify-end">
                  {showLoadingDots ? (
                    <div className="bg-white border border-[#e2e4e7] border-solid w-[361px] h-[62px] px-[16px] py-[16px] rounded-tl-[16px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px] flex items-center justify-center">
                      <LoadingDot className="h-[30px] w-[68px] animate-pulse" />
                    </div>
                  ) : userAnswer ? (
                    <div className="bg-white border border-[#e2e4e7] border-solid w-[361px] min-h-[62px] px-[16px] py-[16px] rounded-tl-[16px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px] flex items-center justify-center">
                      <p className="text-[20px] font-normal leading-[1.5] text-[#3c434f] text-center break-words">
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

    
      <div className="flex justify-center shrink-0 py-3">
        {isRecording ? (
         
          <button
            onClick={handleStopRecording}
            className="relative flex items-center justify-center size-[88px] cursor-pointer"
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
              'flex items-center justify-center size-[88px] cursor-pointer',
              (!activeConversation || !isComplete) && 'opacity-100 cursor-not-allowed'
            )}
            aria-label="녹음하기"
          >
            {!isComplete ? (
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
