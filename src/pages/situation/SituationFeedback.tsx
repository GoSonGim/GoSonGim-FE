import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConversationList } from '@/components/situation/conversation';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import ScrollGuideIcon from '@/assets/svgs/situation/scrollGuide.svg';
import clsx from 'clsx';
import type { FinalSummary, Turn } from '@/types/situation';

/**
 * 상황극 최종 피드백 페이지
 */
export default function SituationFeedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // 대화 페이지에서 전달받은 최종 요약 데이터 및 대화 히스토리
  const finalSummary = location.state?.finalSummary as FinalSummary | undefined;
  const turns = (location.state?.turns as Turn[] | undefined) || [];

  // 점수에 따른 등급 및 색상
  const getGrade = (score: number) => {
    if (score >= 95) return { grade: '최고예요!', color: 'text-blue-1', emoji: '🎉' };
    if (score >= 90) return { grade: '훌륭해요!', color: 'text-blue-1', emoji: '😊' };
    if (score >= 80) return { grade: '잘했어요!', color: 'text-green-500', emoji: '👍' };
    if (score >= 70) return { grade: '괜찮아요', color: 'text-yellow-500', emoji: '😐' };
    return { grade: '다시 도전!', color: 'text-orange-500', emoji: '💪' };
  };

  const { averageScore = 0, finalFeedback = '' } = finalSummary || {};
  const { grade, color, emoji } = getGrade(averageScore);

  // 스크롤 가능 여부 확인
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const hasScroll = scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
        setShowScrollIndicator(hasScroll);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [turns.length]);

  // 완료 버튼 클릭 (홈으로 이동)
  const handleComplete = () => {
    navigate('/home');
  };

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 데이터가 없으면 홈으로 리다이렉트
  if (!finalSummary) {
    navigate('/home', { replace: true });
    return null;
  }

  return (
    <div className="bg-background-primary flex h-full flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <div className="h-16 w-full shrink-0 overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            aria-label="뒤로가기"
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </button>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">대화 결과</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        {/* 이모지 + 등급 + 평균 점수 */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 text-6xl">{emoji}</div>
          <h1 className={clsx('text-heading-01-bold mb-2', color)}>{grade}</h1>
          <div className="flex items-baseline gap-1">
            <span className="text-display-01-bold text-gray-100">{averageScore.toFixed(1)}</span>
            <span className="text-body-01-medium text-gray-60">/ 100점</span>
          </div>
        </div>

        {/* 대화 히스토리 (흰색 박스) */}
        <div className="relative mb-6 w-full rounded-[16px] bg-white p-4 shadow-lg">
          <div
            ref={scrollRef}
            className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <ConversationList turns={turns} currentTurnIndex={turns.length} isProcessing={false} />
          </div>
          {/* 스크롤 가능 표시 */}
          {showScrollIndicator && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="text-gray-40 animate-bounce">
                <ScrollGuideIcon className="size-10" />
              </div>
            </div>
          )}
        </div>

        {/* 피드백 메시지 */}
        <div className="mb-6 w-full rounded-[12px] bg-white p-6 shadow-lg">
          <p className="text-body-01-regular text-gray-80 text-center leading-relaxed whitespace-pre-wrap">
            {finalFeedback}
          </p>
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleComplete}
          className="bg-blue-1 hover:bg-blue-1-hover text-body-01-semibold mx-auto h-12 w-full max-w-[200px] cursor-pointer rounded-[8px] text-white transition-colors"
        >
          완료
        </button>
      </div>
    </div>
  );
}
