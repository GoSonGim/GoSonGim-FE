import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import { articulationTypeConfig, type ArticulationType } from '@/mock/search/articulationPractice.mock';

const ArticulationStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: ArticulationType }>();

  // type이 유효하지 않으면 기본값 사용
  const validType = type && articulationTypeConfig[type] ? type : 'lip-sound';
  const config = articulationTypeConfig[validType];

  // URL 패턴에서 기본 경로 추출
  const basePath = location.pathname.includes('articulation-position')
    ? 'articulation-position'
    : 'articulation-method';

  const handleButtonClick = () => {
    navigate(`/search/${basePath}/${validType}/practice`);
  };

  const handleBackClick = () => {
    navigate(`/search/${basePath}/${validType}/step1`);
  };

  // 3초 후 자동 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/search/${basePath}/${validType}/practice`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, basePath, validType]);

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          <div
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            onClick={handleBackClick}
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>
          <p className="text-heading-02-regular text-gray-100">{config.name}</p>
        </div>
      </div>

      {/* 상단 진행바 (1단계 활성) */}
      <AnimatedContainer variant="fadeInUpSmall" delay={0} className="px-4 py-3" disabled={false}>
        <div className="flex gap-2">
          <div className="bg-blue-1 h-1 flex-1 rounded-full" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
        </div>
      </AnimatedContainer>

      {/* 본문 */}
      <div className="relative flex flex-1 flex-col items-center px-4 py-4 pb-12">
        <div className="flex w-full flex-col gap-10">
          {/* 단계 정보 */}
          <div className="flex w-full flex-col gap-2">
            <AnimatedContainer variant="fadeInUp" delay={0.1} className="mb-2 w-full text-left" disabled={false}>
              <p className="text-detail-01 text-gray-60">1단계</p>
              <h2 className="text-heading-02-semibold text-gray-100">근육 강화하기</h2>
            </AnimatedContainer>

            {/* 흰색 박스 */}
            <AnimatedContainer
              variant="fadeInScale"
              delay={0.2}
              className="border-gray-20 w-full overflow-visible rounded-[16px] border bg-white"
              disabled={false}
            >
              {/* 352px 높이의 빈 컨테이너 */}
              <div className="relative h-[352px] w-full">
                {/* GREAT! 텍스트 중앙 배치 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <p className="text-[48px] font-medium text-nowrap whitespace-pre text-[#ff1f1f]">GREAT!</p>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* 버튼 */}
          <AnimatedContainer
            variant="fadeIn"
            delay={0.25}
            className="flex w-full flex-col items-center gap-4"
            disabled={false}
          >
            <button
              onClick={handleButtonClick}
              className="text-heading-02-semibold border-blue-1 text-gray-80 hover:bg-gray-10 h-12 w-72 cursor-pointer rounded-full border bg-white transition-colors"
            >
              다음 진행하기
            </button>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ArticulationStep2;
