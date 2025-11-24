import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';
import Mike2 from '@/assets/svgs/home/mike2.svg';
import WhiteSquare from '@/assets/svgs/home/whitesquare.svg';
import BlueCircle from '@/assets/svgs/home/bluecircle.svg';
import MarkLeft from '@/assets/svgs/search/studyfind-markleft.svg';
import MarkRight from '@/assets/svgs/search/studyfind-markright.svg';
import LoadingDot from '@/assets/svgs/search/studyfind-loadingdot.svg';
import CheckIcon from '@/assets/svgs/search/studyfind-check.svg';
import ArrowRight from '@/assets/svgs/home/arrow-right.svg';
import CircularProgress from '@/components/freetalk/CircularProgress';
import { diagnosisSentence } from '@/mock/talkingkit/soundPosition/kitDiagnosis.mock';
import { useRandomSituations } from '@/hooks/home/useRandomSituations';
import { useKitDiagnosis } from '@/hooks/search/kitDiagnosis/useKitDiagnosis';
import { getSituationCategoryName, getSituationCategoryQuery } from '@/utils/studytalk/categoryUtils';

const KitDiagnosis = () => {
  const navigate = useNavigate();
  const { randomSituations } = useRandomSituations();

  const {
    // State
    step,
    diagnosisResult,
    showModal,

    // Recording
    isRecording,
    progress,
    handleStartRecording,
    handleStopRecording,

    // Bookmark
    savedKits,
    handleToggleSaveKit,
    handleSaveAll,

    // Actions
    handleRetry,
    handleGoToStudyTalk,
    handleCloseModal,
    handleConfirmNoSave,
  } = useKitDiagnosis();

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* Header */}
      <div className="relative flex h-16 items-center overflow-clip bg-white px-0 py-2">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 flex size-12 cursor-pointer items-center justify-center p-2"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[10px]" />
        </button>
        <p className="text-heading-02-regular absolute left-1/2 -translate-x-1/2 text-center text-gray-100">
          조음•발음 키트 진단받기
        </p>
      </div>

      {/* Step 1: 진단 시작 */}
      {step === 'start' && (
        <>
          <div className="flex flex-col items-center gap-12 px-4 pt-10">
            {/* 문장 박스 */}
            <div className="flex h-[186px] w-full flex-col gap-5 rounded-2xl bg-white p-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center">
                  <MarkLeft className="size-5" />
                </div>
                <MarkRight className="size-5" />
              </div>
              <p className="text-body-01-semibold text-gray-80 text-center">{diagnosisSentence}</p>
            </div>

            {/* 안내 텍스트 */}
            <div className="text-body-01-regular text-gray-80 text-center">
              <p>위 문장을 읽어주세요.</p>
              <p>키트 탐색을 도와드릴게요</p>
            </div>
          </div>

          {/* 녹음 버튼 */}
          <div className="flex flex-1 items-end justify-center pb-[72px]">
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
                onClick={handleStartRecording}
                className="flex size-[88px] cursor-pointer items-center justify-center"
                aria-label="녹음하기"
              >
                <Mike2 className="size-[88px]" />
              </button>
            )}
          </div>
        </>
      )}

      {/* Step 2: 로딩 */}
      {step === 'loading' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-[116px]">
          <div className="flex h-[38px] w-[146px] items-center justify-center">
            <LoadingDot className="h-[38px] w-[146px]" />
          </div>
          <p className="text-heading-02-regular text-gray-80">진단중...</p>
        </div>
      )}

      {/* Step 3: 결과 */}
      {step === 'result' && (
        <>
          <main className="flex-1 overflow-y-auto pb-40 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-8 px-4 pt-[17px]">
              {/* 제목 */}
              {diagnosisResult?.recommendedKits && diagnosisResult.recommendedKits.length > 0 ? (
                <div className="text-heading-01 text-gray-100">
                  <p>다현님은</p>
                  <p>해당 키트가 필요해요</p>
                </div>
              ) : (
                <div className="text-heading-01 text-gray-100">
                  <p>발음이 아주 좋습니다!</p>
                  <p>상황극 연습을 추천드려요.</p>
                </div>
              )}

              {/* 모두 담기 버튼 + 키트 리스트 */}
              {diagnosisResult?.recommendedKits && diagnosisResult.recommendedKits.length > 0 ? (
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={handleSaveAll}
                    className="border-gray-10 hover:bg-gray-10 flex cursor-pointer items-center justify-center rounded-full border bg-white px-4 py-2 transition-colors"
                  >
                    <p className="text-body-02-regular text-gray-100">모두 내학습에 담기</p>
                  </button>

                  <div className="flex w-full flex-col gap-2">
                    {diagnosisResult.recommendedKits.map((kit) => {
                      const isSaved = savedKits.has(kit.kitId);
                      return (
                        <div
                          key={kit.kitId}
                          className="flex h-[66px] items-center justify-between rounded-lg bg-white px-4 py-2"
                        >
                          <div className="flex flex-col gap-[2px] leading-normal">
                            <p className="text-detail-02 text-gray-60">조음 키트</p>
                            <p className="text-heading-02-semibold text-gray-100">{kit.kitName}</p>
                          </div>
                          <button
                            onClick={() => handleToggleSaveKit(kit.kitId)}
                            className={`flex items-center justify-center gap-[10px] rounded-full border px-4 py-2 transition-colors ${
                              isSaved ? 'border-blue-1 bg-white' : 'border-gray-40 hover:bg-gray-10 bg-white'
                            }`}
                          >
                            {isSaved ? (
                              <CheckIcon className="size-[14px]" />
                            ) : (
                              <div className="bg-gray-40 size-[14px] rounded-full" />
                            )}
                            <p
                              className={`text-body-01-semibold cursor-pointer ${isSaved ? 'text-gray-100' : 'text-gray-40'}`}
                            >
                              담기
                            </p>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-col gap-6">
                  <p className="text-heading-01 text-gray-100">
                    이런 <span className="text-blue-1">상황 연습</span>은 어떠신가요?
                  </p>

                  <div className="flex flex-col gap-2">
                    {randomSituations && randomSituations.length > 0 ? (
                      randomSituations.map((situation) => (
                        <div
                          key={situation.situationId}
                          onClick={() => {
                            const categoryQuery = getSituationCategoryQuery(situation.categoryEnum);
                            navigate(`/search/situation/${categoryQuery}/${situation.situationId}`);
                          }}
                          className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-3 py-4 shadow-lg hover:bg-[#f1f1f5]"
                        >
                          <div className="flex items-center gap-1 leading-normal">
                            <p className="text-heading-02-semibold whitespace-nowrap text-gray-100">
                              {situation.situationName}
                            </p>
                            <p className="text-detail-02 whitespace-nowrap text-gray-50">
                              •{getSituationCategoryName(situation.categoryEnum)}
                            </p>
                          </div>
                          <button
                            aria-label={`${situation.situationName} 시작하기`}
                            className="flex shrink-0 items-center justify-center"
                          >
                            <ArrowRight />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-[100px] items-center justify-center rounded-lg bg-white">
                        <p className="text-body-01-regular text-gray-60">상황 연습을 불러오는 중...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* 하단 버튼 */}
          <div className="absolute bottom-0 left-0 flex w-full gap-4 px-[15px] pb-[68px]">
            <button
              onClick={handleRetry}
              className="bg-gray-20 hover:bg-gray-40 flex h-16 w-[173px] cursor-pointer items-center justify-center rounded-lg p-[10px] transition-colors"
            >
              <p className="text-body-01-semibold text-gray-100">다시 탐색하기</p>
            </button>
            <button
              onClick={handleGoToStudyTalk}
              className="bg-blue-1 hover:bg-blue-1-hover flex h-16 w-[173px] cursor-pointer items-center justify-center rounded-lg p-[10px] transition-colors"
            >
              <p className="text-body-01-semibold text-white">내 학습 가기</p>
            </button>
          </div>
        </>
      )}

      {/* 모달 */}
      {showModal && (
        <div className="bg-background-modal fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col gap-8 rounded-2xl bg-white px-4 py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-heading-01 text-gray-100">학습을 담지 않으시겠습니까?</p>
              <div className="text-body-01-regular text-gray-60 h-[54px] w-[253px]">
                <p>진단 내역은 저장되지 않아</p>
                <p>다시 확인할 수 없습니다.</p>
              </div>
            </div>
            <div className="flex w-full gap-2">
              <button
                onClick={handleCloseModal}
                className="bg-gray-20 flex w-[152px] cursor-pointer items-center justify-center rounded-lg px-[45px] py-3"
              >
                <p className="text-body-01-regular text-gray-80 whitespace-nowrap">취소하기</p>
              </button>
              <button
                onClick={handleConfirmNoSave}
                className="bg-blue-1 flex w-[152px] cursor-pointer items-center justify-center rounded-lg px-[45px] py-3"
              >
                <p className="text-body-01-regular whitespace-nowrap text-white">담지 않기</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitDiagnosis;
