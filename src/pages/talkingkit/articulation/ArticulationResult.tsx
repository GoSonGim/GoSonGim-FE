import { useNavigate, useLocation, useParams } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import { articulationTypeConfig, type ArticulationType } from '@/constants/search/articulationPractice';
import type { LipSoundEvaluationResponse } from '@/types/search';

const ArticulationResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: ArticulationType }>();
  const evaluationResult = location.state?.evaluationResult as LipSoundEvaluationResponse['result'] | undefined;
  const individualResults = evaluationResult?.individualResults ?? [];
  const overallResult = evaluationResult?.overallResult;

  // type이 유효하지 않으면 기본값 사용
  const validType = type && articulationTypeConfig[type] ? type : 'lip-sound';
  const config = articulationTypeConfig[validType];

  // URL 패턴에서 기본 경로 추출
  const basePath = location.pathname.includes('articulation-position')
    ? 'articulation-position'
    : 'articulation-method';

  const handleButtonClick = () => {
    navigate('/search'); // 학습탐색 메인 페이지로 이동
  };

  const handleBackClick = () => {
    navigate(`/search/${basePath}/${validType}/practice`);
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col overflow-y-auto">
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

      {/* 진행바 (2단계 활성) */}
      <AnimatedContainer variant="fadeInUpSmall" delay={0} className="px-4 py-3" disabled={false}>
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
          <div className="bg-blue-1 h-1 flex-1 rounded-full" />
        </div>
      </AnimatedContainer>

      {/* 본문 - 전체 스크롤 가능 */}
      <div className="flex w-full flex-col items-center px-4 pb-8">
        <div className="flex w-[360px] flex-col gap-4">
          {/* 제목 섹션 */}
          <AnimatedContainer variant="fadeInUp" delay={0.1} className="flex w-full flex-col gap-2" disabled={false}>
            <p className="text-detail-01 text-gray-60">2단계</p>
            <h2 className="text-heading-02-semibold text-gray-100">실전 발음 연습</h2>
          </AnimatedContainer>

          {/* 흰색 박스: 400px 고정, 내부 스크롤 */}
          <AnimatedContainer variant="fadeInScale" delay={0.2} disabled={false}>
            <div className="border-gray-20 h-[400px] w-full overflow-y-auto rounded-2xl border bg-white p-6">
              {evaluationResult ? (
                <div className="flex flex-col gap-6">
                  {/* 전체 점수 */}
                  {overallResult && (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-body-01-regular text-gray-60">전체 점수</p>
                      <p className="text-blue-1 text-[48px] font-semibold">{overallResult.overallScore.toFixed(1)}점</p>
                      <p className="text-body-02-regular text-gray-80 text-center">{overallResult.overallFeedback}</p>
                    </div>
                  )}

                  {/* 개별 결과 */}
                  <div className="flex flex-col gap-4">
                    {individualResults.map((result: LipSoundEvaluationResponse['result']['individualResults'][0]) => (
                      <div key={result.kitStageId} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-heading-02-semibold text-gray-100">{result.targetWord}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-caption-01-semibold rounded-full px-3 py-1 ${
                                result.isSuccess ? 'bg-blue-10 text-blue-1' : 'bg-red-10 text-red-50'
                              }`}
                            >
                              {result.isSuccess ? '성공' : '재도전'}
                            </span>
                            <p className="text-heading-02-semibold text-blue-1">
                              {result.evaluationScore.toFixed(1)}점
                            </p>
                          </div>
                        </div>
                        <p className="text-body-02-regular text-gray-60">
                          인식된 발음: {result.recognizedText.replace(/\.$/, '')}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-10 rounded-xl p-3">
                            <p className="text-caption-01-semibold text-gray-60">정확도</p>
                            <p className="text-heading-03-semibold text-gray-100">
                              {result.pronunciation.accuracy.toFixed(1)}
                            </p>
                          </div>
                          <div className="bg-gray-10 rounded-xl p-3">
                            <p className="text-caption-01-semibold text-gray-60">유창성</p>
                            <p className="text-heading-03-semibold text-gray-100">
                              {result.pronunciation.fluency.toFixed(1)}
                            </p>
                          </div>
                          <div className="bg-gray-10 rounded-xl p-3">
                            <p className="text-caption-01-semibold text-gray-60">완성도</p>
                            <p className="text-heading-03-semibold text-gray-100">
                              {result.pronunciation.completeness.toFixed(1)}
                            </p>
                          </div>
                          <div className="bg-gray-10 rounded-xl p-3">
                            <p className="text-caption-01-semibold text-gray-60">운율</p>
                            <p className="text-heading-03-semibold text-gray-100">
                              {result.pronunciation.prosody.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-body-01-regular text-gray-60 text-center">평가 결과를 불러오는 중입니다...</p>
                </div>
              )}
            </div>
          </AnimatedContainer>

          {/* 완료하기 버튼 - 박스 바깥 */}
          <AnimatedContainer variant="fadeIn" delay={0.25} disabled={false}>
            <button
              onClick={handleButtonClick}
              className="text-heading-02-semibold bg-blue-1 top-150 ml-8 h-12 w-72 cursor-pointer self-center rounded-full text-white transition-colors hover:bg-blue-600"
            >
              완료하기
            </button>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ArticulationResult;
