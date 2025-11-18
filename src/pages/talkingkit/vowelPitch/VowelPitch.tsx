import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Mike2 from '@/assets/svgs/talkingkit/vowelPitch/mike2.svg';
import { usePitchDetection } from '@/hooks/talkingkit/common/usePitchDetection';
import { useAudioRecorder } from '@/hooks/common/useAudioRecorder';
import PitchVisualizer from '@/components/talkingkit/vowelPitch/PitchVisualizer';
import CircularProgress from '@/components/talkingkit/progressBar/CircularProgress';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import Step2Layout from '@/components/talkingkit/layout/Step2Layout';
import { useKitDetail } from '@/hooks/talkingkit/queries/useKitDetail';

const VowelPitch = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { data: kitDetail } = useKitDetail(1); // kitId: 1 (길게 소리내기)

  // API에서 받아온 2단계 이름 (stageId: 2)
  const stage2Name: string =
    kitDetail?.result.stages.find((stage) => stage.stageId === 2)?.stageName || '모음 길게 소리내기';

  const {
    isDetecting,
    pitchDataList,
    baselineFrequency,
    evaluationResult,
    startDetection,
    stopDetection,
    resetDetection,
  } = usePitchDetection({
    maxDuration: 4000, // 4초
    minDuration: 2000, // 2초 (최소값)
  });

  const { startRecording, stopRecording } = useAudioRecorder();

  // 평가 결과가 생성되면 결과 페이지로 이동
  useEffect(() => {
    if (shouldNavigate && evaluationResult) {
      // evaluationResult와 audioBlob을 함께 전달하기 위해 비동기 처리
      const prepareNavigation = async () => {
        const audioBlob = await stopRecording();
        navigate('/talkingkit/vowel-pitch/result', {
          state: { evaluationResult, audioBlob },
        });
        setShouldNavigate(false);
      };
      prepareNavigation();
    }
  }, [evaluationResult, shouldNavigate, navigate, stopRecording]);

  // 녹음 완료 - 바로 결과 페이지로 이동
  const handleRecordingComplete = useCallback(() => {
    stopDetection();
    setIsRecording(false);
    setShouldNavigate(true);
  }, [stopDetection]);

  // 마이크 아이콘 클릭 - 녹음 시작
  const handleMicClick = async () => {
    setError(null);
    resetDetection();
    setIsRecording(true);
    setShouldNavigate(false);

    try {
      // Pitch detection과 audio recording 동시 시작
      await Promise.all([startDetection(), startRecording()]);

      // 4초 타이머 시작
      setTimeout(() => {
        handleRecordingComplete();
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '음정 감지를 시작할 수 없습니다.');
      setIsRecording(false);
    }
  };

  return (
    <>
      <Step2Layout
        headerTitle="길게 소리내기"
        title={stage2Name}
        showAction={false}
        onBackClick={() => navigate(-1)}
      >
        <PitchVisualizer
          pitchDataList={pitchDataList}
          baselineFrequency={baselineFrequency}
          isDetecting={isDetecting}
        />
      </Step2Layout>

      {/* 하단: 안내 문구 + 마이크 아이콘 그룹 */}
      <div className="absolute top-[570px] left-1/2 flex w-[288px] -translate-x-1/2 flex-col items-center gap-4">
        {/* 안내 문구 */}
        <AnimatedContainer variant="fadeIn" delay={0.2}>
          <p className="text-body-02-regular text-gray-60 h-6 w-full text-center">선을 따라 일정하게 발음해주세요</p>
        </AnimatedContainer>

        {/* 마이크 아이콘 또는 CircularProgress */}
        <AnimatedContainer variant="fadeIn" delay={0.3}>
          {!isRecording ? (
            <button
              onClick={handleMicClick}
              className="flex size-[88px] cursor-pointer items-center justify-center"
              aria-label="녹음 시작"
            >
              <Mike2 className="h-full w-full" />
            </button>
          ) : (
            <CircularProgress duration={4000} onComplete={handleRecordingComplete} />
          )}
        </AnimatedContainer>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="absolute bottom-4 left-1/2 w-[320px] -translate-x-1/2">
          <AnimatedContainer variant="fadeIn" delay={0} className="rounded-lg bg-red-100 px-4 py-3 text-center">
            <p className="text-detail-01 text-red-600">{error}</p>
          </AnimatedContainer>
        </div>
      )}
    </>
  );
};

export default VowelPitch;
