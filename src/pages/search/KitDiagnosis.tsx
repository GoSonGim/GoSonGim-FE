import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';
import Mike2 from '@/assets/svgs/home/mike2.svg';
import WhiteSquare from '@/assets/svgs/home/whitesquare.svg';
import BlueCircle from '@/assets/svgs/home/bluecircle.svg';
import MarkLeft from '@/assets/svgs/studyfind/studyfind-markleft.svg';
import MarkRight from '@/assets/svgs/studyfind/studyfind-markright.svg';
import LoadingDot from '@/assets/svgs/studyfind/studyfind-loadingdot.svg';
import CheckIcon from '@/assets/svgs/studyfind/studyfind-check.svg';
import CircularProgress from '@/components/freetalk/CircularProgress';
import { diagnosisSentence } from '@/mock/search/kitDiagnosis.mock';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { kitAPI } from '@/apis/kit.api';
import { logger } from '@/utils/loggerUtils';
import type { KitDiagnosisResponse } from '@/types/kit.types';

type StepType = 'start' | 'loading' | 'result';

const KitDiagnosis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepType>('start');
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedKits, setSavedKits] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<KitDiagnosisResponse['result'] | null>(null);

  const { startRecording, stopRecording } = useAudioRecorder();

  // 녹음 완료 처리
  const handleRecordingComplete = useCallback(async () => {
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
      logger.log('녹음 완료, Blob 크기:', blob.size);
    }
    // 로딩 단계로 전환
    setStep('loading');
  }, [stopRecording]);

  // 8초 녹음 타이머
  useEffect(() => {
    if (!isRecording) return;

    const duration = 8000; // 8초
    const interval = 50; // 50ms마다 업데이트
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsRecording(false);
          setProgress(0);
          // 녹음 완료 후 audioBlob 획득
          handleRecordingComplete();
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isRecording, handleRecordingComplete]);

  // API 호출 로직
  useEffect(() => {
    if (step !== 'loading' || !audioBlob) {
      logger.warn('API 호출 조건 미충족 - step:', step, 'audioBlob:', audioBlob);
      return;
    }

    const callDiagnosisAPI = async () => {
      try {
        // 디버깅: audioBlob 상태 확인
        logger.log('audioBlob 정보:', {
          size: audioBlob.size,
          type: audioBlob.type,
        });

        // 1. Blob을 File로 변환
        const audioFile = new File([audioBlob], 'diagnosis.wav', { type: 'audio/wav' });

        // 디버깅: File 객체 확인
        logger.log('audioFile 정보:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type,
        });

        // 2. FormData 생성
        const formData = new FormData();
        formData.append('targetText', diagnosisSentence);
        formData.append('audioFile', audioFile);

        // 디버깅: FormData 내용 확인
        logger.log('FormData 내용:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            logger.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type });
          } else {
            logger.log(`  ${key}:`, value);
          }
        }

        // 3. API 호출
        logger.log('진단 API 호출 시작...');
        const response = await kitAPI.diagnosisKit(formData);

        // 4. 콘솔 출력
        logger.log('진단 결과:', response);

        // 5. State 저장
        setDiagnosisResult(response.result);

        // 6. result 화면으로 전환 (약간의 딜레이 후)
        setTimeout(() => {
          setStep('result');
        }, 500);
      } catch (error) {
        logger.error('진단 API 호출 실패:', error);
        // 에러 발생 시에도 result 화면으로 이동 (mock 데이터로 폴백 가능)
        setTimeout(() => {
          setStep('result');
        }, 500);
      }
    };

    callDiagnosisAPI();
  }, [step, audioBlob]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
      setProgress(0);
    } catch (error) {
      logger.error('녹음 시작 실패:', error);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setProgress(0);
  };

  const handleToggleSaveKit = (kitId: number) => {
    setSavedKits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(kitId)) {
        newSet.delete(kitId);
      } else {
        newSet.add(kitId);
      }
      return newSet;
    });
  };

  const handleSaveAll = () => {
    if (diagnosisResult?.recommendedKits) {
      const allKitIds = new Set(diagnosisResult.recommendedKits.map((kit) => kit.kitId));
      setSavedKits(allKitIds);
    }
  };

  const handleRetry = () => {
    setStep('start');
    setProgress(0);
    setIsRecording(false);
    setSavedKits(new Set());
    setAudioBlob(null);
    setDiagnosisResult(null);
  };

  const handleGoToStudyTalk = () => {
    if (savedKits.size === 0) {
      setShowModal(true);
    } else {
      logger.log('내 학습 가기로 라우팅');
      // TODO: 내 학습 페이지로 라우팅
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmNoSave = () => {
    logger.log('내 학습 가기로 라우팅');
    // TODO: 내 학습 페이지로 라우팅
    setShowModal(false);
  };

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
              <div className="text-[24px] leading-normal font-medium text-gray-100">
                <p>다현님은</p>
                <p>해당 키트가 필요해요</p>
              </div>

              {/* 모두 담기 버튼 + 키트 리스트 */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleSaveAll}
                  className="border-gray-10 hover:bg-gray-10 flex cursor-pointer items-center justify-center rounded-full border bg-white px-4 py-2 transition-colors"
                >
                  <p className="text-body-02-regular text-gray-100">모두 내학습에 담기</p>
                </button>

                <div className="flex w-full flex-col gap-2">
                  {diagnosisResult?.recommendedKits && diagnosisResult.recommendedKits.length > 0 ? (
                    diagnosisResult.recommendedKits.map((kit) => {
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
                            <p className={`text-body-01-semibold ${isSaved ? 'text-gray-100' : 'text-gray-40'}`}>담기</p>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-[100px] items-center justify-center rounded-lg bg-white">
                      <p className="text-body-01-regular text-gray-60">추천 키트가 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* 하단 버튼 */}
          <div className="absolute bottom-0 left-0 flex w-full gap-4 px-[15px] pb-[68px]">
            <button
              onClick={handleRetry}
              className="bg-gray-20 hover:bg-gray-40 flex h-16 w-[173px] items-center justify-center rounded-lg p-[10px] transition-colors"
            >
              <p className="text-body-01-semibold text-gray-100">다시 탐색하기</p>
            </button>
            <button
              onClick={handleGoToStudyTalk}
              className="bg-blue-1 hover:bg-blue-1-hover flex h-16 w-[173px] items-center justify-center rounded-lg p-[10px] transition-colors"
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
                className="bg-gray-20 flex w-[152px] items-center justify-center rounded-lg px-[45px] py-3"
              >
                <p className="text-body-01-regular text-gray-80 whitespace-nowrap">취소하기</p>
              </button>
              <button
                onClick={handleConfirmNoSave}
                className="bg-blue-1 flex w-[152px] items-center justify-center rounded-lg px-[45px] py-3"
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
