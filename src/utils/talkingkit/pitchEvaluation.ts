import type { PitchData, PitchEvaluationResult } from '@/types/talkingkit/pitch';

/**
 * 표준편차 계산
 */
export const calculateStandardDeviation = (frequencies: number[]): number => {
  if (frequencies.length === 0) return 0;

  const mean = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
  const squaredDiffs = frequencies.map((freq) => Math.pow(freq - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / frequencies.length;

  return Math.sqrt(variance);
};

/**
 * 목표 범위 내 시간 비율 계산
 * 기준 주파수의 ±20Hz 범위 내에 있는 데이터 비율
 */
export const calculateInRangePercentage = (pitchDataList: PitchData[], baselineFrequency: number): number => {
  if (pitchDataList.length === 0) return 0;

  const tolerance = 20; // ±20Hz
  const minFreq = baselineFrequency - tolerance;
  const maxFreq = baselineFrequency + tolerance;

  const inRangeCount = pitchDataList.filter((data) => {
    return data.frequency >= minFreq && data.frequency <= maxFreq;
  }).length;

  return (inRangeCount / pitchDataList.length) * 100;
};

/**
 * 주파수를 음정 이름으로 변환
 */
export const frequencyToNote = (frequency: number): string => {
  if (frequency === 0) return '-';

  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);

  const halfSteps = Math.round(12 * Math.log2(frequency / C0));
  const octave = Math.floor(halfSteps / 12);
  const noteIndex = halfSteps % 12;

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return `${notes[noteIndex]}${octave}`;
};

/**
 * 종합 평가 수행
 */
export const evaluatePitch = (pitchDataList: PitchData[], baselineFrequency: number): PitchEvaluationResult => {
  if (pitchDataList.length === 0) {
    return {
      score: 0,
      standardDeviation: 0,
      inRangePercentage: 0,
      averageFrequency: 0,
      baselineFrequency,
      feedback: '데이터가 부족합니다. 더 길게 소리를 내주세요.',
      isSuccess: false,
    };
  }

  const frequencies = pitchDataList.map((data) => data.frequency);
  const averageFrequency = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
  const standardDeviation = calculateStandardDeviation(frequencies);
  const inRangePercentage = calculateInRangePercentage(pitchDataList, baselineFrequency);

  // 시간 기반 점수 계산 (각 시점마다 점수 계산 후 평균)
  // 각 데이터 포인트의 픽셀 오프셋과 해당 시점의 점수 계산
  const allowanceHz = 3; // ±3Hz는 "머무른다"고 판단 (더 빡세게)

  const scorePerPoint = pitchDataList.map((data) => {
    const frequencyDiff = Math.abs(data.frequency - baselineFrequency);

    let pointScore: number;

    if (frequencyDiff <= allowanceHz) {
      // ±3Hz 이내는 완벽한 점수 (100점)
      pointScore = 100;
    } else {
      // 3Hz 초과부터 감점 시작
      const excessHz = frequencyDiff - allowanceHz;
      // 1Hz당 8점 감점 (3Hz 초과 시작, 15.5Hz에서 0점) - 더 빡세게
      pointScore = Math.max(0, 100 - excessHz * 8);
    }

    return {
      frequency: data.frequency,
      frequencyDiff,
      score: pointScore,
    };
  });

  // 각 시점 점수들의 평균 = 기준선에 얼마나 오래 머물렀는가
  const totalScore = scorePerPoint.reduce((sum, point) => sum + point.score, 0);
  const finalScore = Math.round(totalScore / scorePerPoint.length);

  // 평균 주파수 차이 (참고용)
  const averageFreqDiff = scorePerPoint.reduce((sum, point) => sum + point.frequencyDiff, 0) / scorePerPoint.length;

  // 상세 디버깅 로그
  console.log('🔍 상세 분석 (시간 기반, ±3Hz 허용, 더 빡세게):', {
    기준주파수: baselineFrequency.toFixed(2) + 'Hz',
    허용범위: '±3Hz (이내는 100점)',
    데이터샘플: scorePerPoint.slice(0, 3).map((p) => ({
      주파수: p.frequency.toFixed(2) + 'Hz',
      차이: p.frequencyDiff.toFixed(2) + 'Hz',
      점수: p.score + '점',
    })),
    평균주파수차이: averageFreqDiff.toFixed(3) + 'Hz',
    최종점수: finalScore + '점',
    총데이터수: pitchDataList.length,
    점수분포: {
      완벽100점: scorePerPoint.filter((p) => p.score === 100).length + '개 (머무른 시간)',
      우수90점이상: scorePerPoint.filter((p) => p.score >= 90).length + '개',
      좋음80점이상: scorePerPoint.filter((p) => p.score >= 80).length + '개',
      보통60점이상: scorePerPoint.filter((p) => p.score >= 60).length + '개',
    },
  });

  // 85점 이상일 때 콘솔에 성공 메시지 출력
  if (finalScore >= 85) {
    console.log('🎉 성공!');
  }

  // 피드백 생성 (더 빡세게)
  let feedback = '';
  if (finalScore >= 95) {
    feedback = '완벽해요! 매우 일정하게 발성했어요! 🎉';
  } else if (finalScore >= 85) {
    feedback = '훌륭해요! 안정적인 발성이에요! 👏';
  } else if (finalScore >= 75) {
    feedback = '좋아요! 조금만 더 일정하게 유지해보세요! 😊';
  } else if (finalScore >= 65) {
    feedback = '괜찮아요! 음정 유지를 조금 더 연습해보세요! 💪';
  } else {
    feedback = '다시 한번 시도해보세요! 일정한 높이로 소리내는 것에 집중해보세요! 🎵';
  }

  return {
    score: finalScore,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    inRangePercentage: Math.round(inRangePercentage * 100) / 100,
    averageFrequency: Math.round(averageFrequency * 100) / 100,
    baselineFrequency,
    feedback,
    isSuccess: finalScore >= 80, // 80점 이상부터 성공 (더 빡세게)
  };
};

/**
 * 음량이 충분한지 확인
 */
export const isSoundLoudEnough = (volume: number, threshold: number = 0.01): boolean => {
  return volume > threshold;
};
