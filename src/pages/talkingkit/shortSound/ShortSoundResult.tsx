import { useNavigate } from 'react-router-dom';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import type { ShortSoundEvaluationResult } from '@/utils/shortSoundEvaluation';

interface ShortSoundResultProps {
  evaluationResult: ShortSoundEvaluationResult;
}

const ShortSoundResult = ({ evaluationResult }: ShortSoundResultProps) => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/talkingkit');
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 상단 헤더 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          <div
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            onClick={() => navigate('/talkingkit')}
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>
          <p className="text-heading-02-regular text-gray-100">일정한 소리 내기</p>
        </div>
      </div>

      {/* 진행바 - 2단계 모두 활성 */}
      <AnimatedContainer variant="fadeInUpSmall" delay={0} className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
          <div className="bg-blue-1 h-1 flex-1 rounded-full" />
        </div>
      </AnimatedContainer>

      {/* 타이틀 */}
      <AnimatedContainer variant="fadeInUp" delay={0.1} className="mb-3 w-full px-4 text-left">
        <p className="text-detail-01 text-gray-60">2단계</p>
        <h2 className="text-heading-02-semibold text-gray-100">짧게 끊어 발성하기</h2>
      </AnimatedContainer>

      {/* 총 점수 박스 */}
      <AnimatedContainer variant="fadeInScale" delay={0.2} className="mb-6 px-4">
        <div className="border-gray-20 flex h-[352px] w-full flex-col items-center justify-center gap-4 rounded-[16px] border bg-white">
          <p className="text-body-01-semibold text-gray-60">총 점수</p>
          <p className="text-blue-1 text-[64px] leading-tight font-bold">
            {evaluationResult.score}
            <span className="text-[32px]">점</span>
          </p>
          <p className="text-body-01-regular text-gray-80 px-6 text-center">{evaluationResult.feedback}</p>
        </div>
      </AnimatedContainer>

      {/* 지점별 점수 박스 */}
      <div className="grid w-full grid-cols-2 gap-4 px-4">
        {/* 1번 지점 박스 */}
        <AnimatedContainer variant="fadeInUp" delay={0.25}>
          <div className="border-gray-20 flex w-full flex-col items-center justify-center gap-3 rounded-[16px] border bg-white px-3 py-6">
            <p className="text-detail-01 text-gray-60">1번 지점</p>
            <p className="text-[28px] leading-tight font-semibold text-gray-100">
              {evaluationResult.point1Score}
              <span className="text-[20px]">점</span>
            </p>
          </div>
        </AnimatedContainer>

        {/* 2번 지점 박스 */}
        <AnimatedContainer variant="fadeInUp" delay={0.3}>
          <div className="border-gray-20 flex w-full flex-col items-center justify-center gap-3 rounded-[16px] border bg-white px-3 py-6">
            <p className="text-detail-01 text-gray-60">2번 지점</p>
            <p className="text-[28px] leading-tight font-semibold text-gray-100">
              {evaluationResult.point2Score}
              <span className="text-[20px]">점</span>
            </p>
          </div>
        </AnimatedContainer>
      </div>

      {/* 완료하기 버튼 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <AnimatedContainer variant="fadeIn" delay={0.35}>
          <button
            onClick={handleComplete}
            className="text-heading-02-semibold bg-blue-1 h-12 w-72 cursor-pointer rounded-full text-white transition-colors hover:bg-blue-600"
          >
            완료하기
          </button>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default ShortSoundResult;
