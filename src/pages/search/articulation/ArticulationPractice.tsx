import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import Mike2 from '@/assets/svgs/home/mike2.svg';
import WhiteSquare from '@/assets/svgs/home/whitesquare.svg';
import BlueCircle from '@/assets/svgs/home/bluecircle.svg';
import CircularProgress from '@/components/freetalk/CircularProgress';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import {
  articulationPracticeWords,
  articulationTypeConfig,
  type ArticulationType,
} from '@/mock/search/articulationPractice.mock';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import { logger } from '@/utils/common/loggerUtils';
import { lipSoundAPI } from '@/apis/search';

const ArticulationPractice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: ArticulationType }>();
  const [currentRound, setCurrentRound] = useState(1);
  const [completedRounds, setCompletedRounds] = useState<Set<number>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const currentRoundRef = useRef(currentRound);
  const fileKeysRef = useRef<Map<number, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { startRecording, stopRecording, error: recorderError } = useAudioRecorder();

  // type이 유효하지 않으면 기본값 사용
  const validType = type && articulationTypeConfig[type] ? type : 'lip-sound';
  const config = articulationTypeConfig[validType];
  const practiceWords = articulationPracticeWords[validType];

  // URL 패턴에서 기본 경로 추출
  const basePath = location.pathname.includes('articulation-position')
    ? 'articulation-position'
    : 'articulation-method';

  // currentRound가 변경될 때 ref도 업데이트
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  const currentWord = practiceWords.find((w) => w.round === currentRound);
  const totalRounds = practiceWords.length;
  const isProcessing = isUploading || isEvaluating;
  const overlayMessage = isUploading ? '녹음 업로드 중...' : '발음 평가 중...';
  const overlaySubMessage = isUploading ? '잠시만 기다려주세요' : '발음을 분석하고 있어요';

  const uploadRecordingToS3 = useCallback(
    async (round: number, blob: Blob) => {
      const wordData = practiceWords.find((w) => w.round === round);
      if (!wordData) {
        throw new Error(`라운드 ${round}에 해당하는 단어를 찾을 수 없습니다.`);
      }

      const uuid =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
      // 한글 파일명 제거: 서버에서 인코딩 문제 발생 방지
      const fileName = `round${round}_${uuid}.wav`;

      setIsUploading(true);

      try {
        const uploadResponse = await lipSoundAPI.getUploadUrl({
          folder: 'kit', // 조음키트 음성 파일
          fileName,
        });

        const { fileKey, url } = uploadResponse.result;

        // S3 presigned URL로 직접 업로드
        // CORS 에러 방지를 위해 커스텀 헤더 제거 (preflight 요청 회피)
        const uploadResult = await fetch(url, {
          method: 'PUT',
          body: blob,
          // Content-Type을 명시하지 않으면 simple request가 되어 preflight 요청 생략 가능
        });

        if (!uploadResult.ok) {
          throw new Error(`S3 업로드 실패 (status: ${uploadResult.status})`);
        }

        logger.log(`${round}차 녹음 업로드 완료`, fileKey);
        return fileKey;
      } catch (error) {
        logger.error(`${round}차 녹음 업로드 실패:`, error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [practiceWords],
  );

  // 발음 평가 요청
  const handleEvaluatePronunciation = useCallback(
    async (allFileKeys: Map<number, string>) => {
      try {
        setIsEvaluating(true);
        logger.log('발음 평가 시작, 총 녹음 파일:', allFileKeys.size);

        // 페이로드 생성: 배열 형태로 3개의 녹음 데이터를 담음
        const payload = Array.from(allFileKeys.entries())
          .sort(([a], [b]) => a - b) // round 순서대로 정렬 (1, 2, 3)
          .map(([round, fileKey]) => {
            const wordData = practiceWords.find((w) => w.round === round);
            return {
              kitStageId: wordData?.kitStageId || round, // kitStageId 사용
              fileKey, // S3 파일 경로
              targetWord: wordData?.word || '', // 바보, 나비, 비밀 등
            };
          });

        logger.log('발음 평가 요청 페이로드:', JSON.stringify(payload, null, 2));
        logger.log('페이로드 길이:', payload.length);

        // API 호출: POST /api/v1/kits/stages/evaluate
        const response = await lipSoundAPI.evaluatePronunciation(payload);
        logger.log('평가 결과:', response);

        // 결과 페이지로 이동
        navigate(`/search/${basePath}/${validType}/result`, {
          state: { evaluationResult: response.result },
        });
      } catch (error) {
        logger.error('발음 평가 실패:', error);
        alert('발음 평가 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsEvaluating(false);
      }
    },
    [navigate, basePath, validType, practiceWords],
  );

  // 녹음 중지 및 저장 처리
  const handleStopRecordingAndSave = useCallback(async () => {
    try {
      const wavBlob = await stopRecording();

      if (!wavBlob) {
        return;
      }

      const completedRound = currentRoundRef.current;

      setIsRecording(false);
      setProgress(0);

      logger.log(`${completedRound}차 녹음 완료:`, {
        round: completedRound,
        size: wavBlob.size,
        type: wavBlob.type,
      });
      logger.log(`${completedRound}차 WAV Blob:`, wavBlob);

      const fileKey = await uploadRecordingToS3(completedRound, wavBlob);

      const updatedFileKeys = new Map(fileKeysRef.current);
      updatedFileKeys.set(completedRound, fileKey);
      fileKeysRef.current = updatedFileKeys;

      setCompletedRounds((prev) => new Set([...prev, completedRound]));

      if (completedRound < totalRounds) {
        setCurrentRound(completedRound + 1);
      } else if (fileKeysRef.current.size === totalRounds) {
        await handleEvaluatePronunciation(fileKeysRef.current);
      }
    } catch (error) {
      logger.error('녹음 저장 또는 업로드 실패:', error);
      alert('녹음 파일을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [stopRecording, uploadRecordingToS3, handleEvaluatePronunciation, totalRounds]);

  // 녹음 에러 처리
  useEffect(() => {
    if (recorderError) {
      logger.error('녹음 에러:', recorderError);
      alert(recorderError);
    }
  }, [recorderError]);

  // 3초 녹음 타이머
  useEffect(() => {
    if (!isRecording) return;

    const duration = 3000; // 3초
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setProgress(0);

          // 녹음 중지 및 WAV 저장
          handleStopRecordingAndSave();

          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isRecording, handleStopRecordingAndSave]);

  // 단어가 변경될 때마다 오디오 재생
  useEffect(() => {
    if (currentWord && !isRecording && !isProcessing) {
      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // 새 오디오 생성 및 재생
      audioRef.current = new Audio(`/audio/review/${currentWord.word}.mp3`);
      audioRef.current.play().catch((error) => {
        logger.error('오디오 재생 실패:', error);
      });
    }

    // 클린업
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentWord, isRecording, isProcessing]);

  const handleStartRecording = async () => {
    if (isUploading || isEvaluating) {
      return;
    }

    try {
      await startRecording();
      setIsRecording(true);
      setProgress(0);
      logger.log(`${currentRound}차 녹음 시작`);
    } catch (error) {
      logger.error('녹음 시작 실패:', error);
    }
  };

  const handleBackClick = () => {
    navigate(`/search/${basePath}/${validType}/step2`);
  };

  const handleRoundClick = (round: number) => {
    if (!isRecording && !isUploading && !isEvaluating) {
      setCurrentRound(round);
    }
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 처리 중 로딩 오버레이 */}
      {isProcessing && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8">
            <div className="border-t-blue-1 size-16 animate-spin rounded-full border-4 border-gray-200"></div>
            <p className="text-heading-02-semibold text-gray-100">{overlayMessage}</p>
            <p className="text-body-02-regular text-gray-60">{overlaySubMessage}</p>
          </div>
        </div>
      )}

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

      {/* 본문 - w-[361px] 중앙 정렬 */}
      <div className="flex w-full flex-col items-center px-4">
        <div className="flex w-[361px] flex-col gap-6">
          {/* 단계 정보 */}
          <AnimatedContainer variant="fadeInUp" delay={0.1} className="w-full text-left" disabled={false}>
            <p className="text-detail-01 text-gray-60">2단계</p>
            <h2 className="text-heading-02-semibold text-gray-100">실전 발음 연습</h2>
          </AnimatedContainer>

          {/* 콘텐츠 영역 - gap-[24px] */}
          <AnimatedContainer variant="fadeInScale" delay={0.2} className="flex w-full flex-col gap-6" disabled={false}>
            {/* 단어 칩 + 박스 섹션 - gap-[8px] */}
            <div className="flex w-full flex-col gap-2">
              {/* 단어 칩 영역 */}
              <div className="flex gap-2">
                {practiceWords.map((wordData) => {
                  const isCompleted = completedRounds.has(wordData.round);
                  const isCurrent = currentRound === wordData.round;
                  const isActive = isCompleted || isCurrent;

                  return (
                    <button
                      key={wordData.round}
                      onClick={() => handleRoundClick(wordData.round)}
                      disabled={isRecording || isProcessing}
                      className={`text-body-02-regular flex items-center justify-center rounded-full border px-4 py-1 transition-colors ${
                        isActive ? 'border-blue-1 text-blue-1 bg-white' : 'bg-gray-20 text-gray-60 border-transparent'
                      } ${!isRecording && !isProcessing && 'cursor-pointer hover:opacity-80'}`}
                    >
                      {wordData.word}
                    </button>
                  );
                })}
              </div>

              {/* 단어 박스 */}
              <div className="flex h-[186px] w-full flex-col gap-5 rounded-2xl bg-white p-4">
                <p className="text-gray-40 w-full text-left text-[18px] leading-normal">{currentWord?.category}</p>
                <p className="w-full text-center text-[40px] leading-normal font-semibold text-gray-100">
                  {currentWord?.word}
                </p>
              </div>
            </div>

            {/* 차수 버튼 */}
            <div className="flex w-full gap-2">
              {[1, 2, 3].map((round) => {
                const isCompleted = completedRounds.has(round);
                const isCurrent = currentRound === round;

                return (
                  <button
                    key={round}
                    onClick={() => handleRoundClick(round)}
                    disabled={isRecording || isProcessing}
                    className={`text-body-01-semibold flex h-[39px] flex-1 items-center justify-center rounded-lg px-3 py-[6px] transition-colors ${
                      isCompleted
                        ? 'bg-blue-1 text-white'
                        : isCurrent
                          ? 'border-blue-1 text-blue-1 border bg-white'
                          : 'bg-gray-20 text-gray-40'
                    } ${!isRecording && !isProcessing && 'cursor-pointer hover:opacity-80'}`}
                  >
                    {isCompleted ? '완료' : `${round}차`}
                  </button>
                );
              })}
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* 하단 안내 텍스트 및 녹음 버튼 - 절대 위치 */}
      <AnimatedContainer
        variant="fadeIn"
        delay={0.25}
        className="absolute top-[522px] left-[72px] flex w-[238px] flex-col items-center gap-4"
        disabled={false}
      >
        <p className="text-body-02-regular text-gray-60 w-full text-center">
          소리를 잘 듣고{'\n'}음성 버튼을 눌러 단어를 발음해주세요
        </p>

        {/* 녹음 버튼 */}
        {isRecording ? (
          <button
            onClick={handleStopRecordingAndSave}
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
            disabled={isUploading || isEvaluating}
            className={`flex size-[88px] items-center justify-center ${isUploading || isEvaluating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            aria-label="녹음하기"
          >
            <Mike2 className="size-[88px]" />
          </button>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default ArticulationPractice;
