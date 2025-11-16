import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import type { PitchEvaluationResult } from '@/types/talkingkit/pitch';

const VowelPitchResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationResult = location.state?.evaluationResult as PitchEvaluationResult | null;

  if (!evaluationResult) {
    // 결과 데이터가 없으면 메인 페이지로 리다이렉트
    navigate('/talkingkit/vowel-pitch', { replace: true });
    return null;
  }

  return (
    <div className="bg-background-primary relative min-h-screen">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <div
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            onClick={() => navigate('/talkingkit/vowel-pitch')}
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">평가 결과</p>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-col items-center px-6 py-10">
        {/* 점수 카드 */}
        <AnimatedContainer variant="fadeInScale" delay={0} className="mb-6 w-full max-w-2xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-heading-02-semibold mb-4 text-gray-100">평가 점수</p>
            <p className="text-blue-1 mb-6 text-[72px] leading-tight font-bold">
              {evaluationResult.score}
              <span className="text-[36px]">점</span>
            </p>
            <p className="text-body-01-regular text-gray-50">{evaluationResult.feedback}</p>
          </div>
        </AnimatedContainer>

        {/* 상세 정보 */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatedContainer variant="fadeInUp" delay={0.1}>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-detail-01 mb-2 text-gray-50">안정성</p>
                <p className="text-[24px] font-semibold text-gray-100">
                  {evaluationResult.standardDeviation.toFixed(2)}Hz
                </p>
                <p className="text-detail-02 text-gray-40 mt-1">(낮을수록 안정적)</p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer variant="fadeInUp" delay={0.15}>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-detail-01 mb-2 text-gray-50">정확도</p>
                <p className="text-[24px] font-semibold text-gray-100">
                  {evaluationResult.inRangePercentage.toFixed(1)}%
                </p>
                <p className="text-detail-02 text-gray-40 mt-1">(±20Hz 범위 내)</p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer variant="fadeInUp" delay={0.2}>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-detail-01 mb-2 text-gray-50">평균 음정🎤</p>
                <p className="text-[24px] font-semibold text-gray-100">
                  {evaluationResult.averageFrequency.toFixed(2)}Hz
                </p>
              </div>
            </AnimatedContainer>

            <AnimatedContainer variant="fadeInUp" delay={0.25}>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-detail-01 mb-2 text-gray-50">첫 음정🎤</p>
                <p className="text-[24px] font-semibold text-gray-100">
                  {evaluationResult.baselineFrequency.toFixed(2)}Hz
                </p>
              </div>
            </AnimatedContainer>
          </div>
        </div>

        {/* 버튼들 */}
        <AnimatedContainer variant="fadeIn" delay={0.3} className="flex w-full max-w-2xl gap-4">
          <button
            onClick={() => navigate('/talkingkit/vowel-pitch')}
            className="text-body-02-semibold bg-blue-1 flex-1 rounded-full py-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-600"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate('/talkingkit')}
            className="text-body-02-semibold flex-1 rounded-full border-2 border-gray-300 py-4 text-gray-600 transition-all hover:scale-105 hover:border-gray-400"
          >
            목록으로
          </button>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default VowelPitchResult;
