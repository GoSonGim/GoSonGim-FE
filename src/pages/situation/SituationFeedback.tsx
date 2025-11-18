import { useNavigate, useLocation } from 'react-router-dom';
import { FeedbackCard } from '@/components/situation/feedback';
import type { FinalSummary } from '@/types/situation';

/**
 * 상황극 최종 피드백 페이지
 * Figma: 394-2381
 */
export default function SituationFeedback() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 대화 페이지에서 전달받은 최종 요약 데이터
  const finalSummary = location.state?.finalSummary as FinalSummary | undefined;

  // 완료 버튼 클릭 (홈으로 이동)
  const handleComplete = () => {
    navigate('/home');
  };

  // 데이터가 없으면 홈으로 리다이렉트
  if (!finalSummary) {
    navigate('/home', { replace: true });
    return null;
  }

  return (
    <div className="bg-background-primary flex h-full flex-col">
      <FeedbackCard finalSummary={finalSummary} onComplete={handleComplete} />
    </div>
  );
}

