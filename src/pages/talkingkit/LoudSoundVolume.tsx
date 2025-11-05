import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Mike2 from '@/assets/svgs/talkingkit/mike2.svg';
import { useDecibelDetection } from '@/hooks/useDecibelDetection';
import CircularProgress from '@/components/talkingkit/CircularProgress';
import AnimatedContainer from '@/components/talkingkit/AnimatedContainer';
import Step2Layout from '@/components/talkingkit/Step2Layout';
import DecibelBar from '@/components/talkingkit/DecibelBar';
import { evaluateVolume } from '@/utils/volumeEvaluation';
import type { VolumeEvaluationResult } from '@/utils/volumeEvaluation';

const LoudSoundVolume = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<VolumeEvaluationResult | null>(null);

  const { isDetecting, currentDecibel, averageDecibel, maxDecibel, startDetection, stopDetection } =
    useDecibelDetection({
      maxDuration: 4000, // 4초
    });

  // 평가 결과가 생성되면 결과 페이지로 이동
  useEffect(() => {
    if (shouldNavigate && evaluationResult) {
      navigate('/talkingkit/3/loud-sound-volume/result', {
        state: { evaluationResult },
      });
      setShouldNavigate(false);
    }
  }, [evaluationResult, shouldNavigate, navigate]);

  // 녹음 완료 - 바로 결과 페이지로 이동
  const handleRecordingComplete = useCallback(() => {
    setIsRecording(false);

    // 평가 수행
    const result = evaluateVolume(maxDecibel, averageDecibel);
    setEvaluationResult(result);
    setShouldNavigate(true);
  }, [maxDecibel, averageDecibel]);

  // 녹음 시작
  const handleStartRecording = async () => {
    if (isRecording) return;

    setError(null);
    setIsRecording(true);

    try {
      await startDetection();
    } catch (err) {
      setError(err instanceof Error ? err.message : '마이크 권한이 필요합니다.');
      setIsRecording(false);
    }
  };

  // 마이크 아이콘 클릭
  const handleMicClick = () => {
    if (!isRecording) {
      handleStartRecording();
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (isRecording) {
      stopDetection();
      setIsRecording(false);
    }
    navigate('/talkingkit/3/loud-sound');
  };

  // 감지가 끝나면 (isDetecting이 false가 되면) 완료 처리
  useEffect(() => {
    if (isRecording && !isDetecting) {
      handleRecordingComplete();
    }
  }, [isRecording, isDetecting, handleRecordingComplete]);

  return (
    <>
      <Step2Layout headerTitle="큰 소리 내기" title="최대 성량으로 말하기" showAction={false} onBackClick={handleBack}>
        <div className="flex h-[352px] w-full flex-col items-center px-6 pt-[39px]">
          {/* 상단: "아빠" 텍스트 */}
          <AnimatedContainer variant="fadeInUp" delay={0.1} className="mb-[74px]">
            <h1 className="text-[32px] leading-normal font-medium text-black">아빠</h1>
          </AnimatedContainer>

          {/* 중간: 데시벨 막대 그래프 */}
          <AnimatedContainer variant="fadeInScale" delay={0.15} className="w-full">
            <DecibelBar currentDecibel={currentDecibel} />
          </AnimatedContainer>

          {/* 에러 메시지 */}
          {error && (
            <AnimatedContainer variant="fadeIn" delay={0} className="mt-4">
              <p className="text-body-02-regular text-center text-red-500">{error}</p>
            </AnimatedContainer>
          )}
        </div>
      </Step2Layout>

      {/* 하단: 안내 문구 + 마이크 아이콘 그룹 */}
      <div className="absolute top-[570px] left-1/2 flex w-[288px] -translate-x-1/2 flex-col items-center gap-4">
        {/* 안내 문구 */}
        <AnimatedContainer variant="fadeIn" delay={0.2}>
          <p className="text-body-02-regular text-gray-60 h-6 w-full text-center">최대 성량으로 발성해보세요!</p>
        </AnimatedContainer>

        {/* 마이크 아이콘 또는 원형 타이머 */}
        {!isRecording ? (
          <AnimatedContainer variant="fadeIn" delay={0.25}>
            <div
              onClick={handleMicClick}
              className="bg-blue-1 flex size-[88px] cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              <Mike2 className="h-full w-full" />
            </div>
          </AnimatedContainer>
        ) : (
          <CircularProgress size={88} duration={4000} onComplete={handleRecordingComplete} />
        )}
      </div>
    </>
  );
};

export default LoudSoundVolume;
