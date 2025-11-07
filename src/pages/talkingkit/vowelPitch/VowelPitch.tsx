import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Mike2 from '@/assets/svgs/talkingkit/vowelPitch/mike2.svg';
import { usePitchDetection } from '@/hooks/talkingkit/common/usePitchDetection';
import PitchVisualizer from '@/components/talkingkit/vowelPitch/PitchVisualizer';
import CircularProgress from '@/components/talkingkit/progressBar/CircularProgress';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import Step2Layout from '@/components/talkingkit/layout/Step2Layout';

const VowelPitch = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

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

  // 평가 결과가 생성되면 결과 페이지로 이동
  useEffect(() => {
    if (shouldNavigate && evaluationResult) {
      navigate('/talkingkit/vowel-pitch/result', {
        state: { evaluationResult },
      });
      setShouldNavigate(false);
    }
  }, [evaluationResult, shouldNavigate, navigate]);

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
      await startDetection();

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
    <div className="bg-background-primary relative min-h-screen">
      <Step2Layout
        headerTitle="길게 소리내기"
        title="모음 길게 소리내기"
        showAction={false}
        onBackClick={() => navigate('/talkingkit')}
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
    </div>
  );
};

export default VowelPitch;
