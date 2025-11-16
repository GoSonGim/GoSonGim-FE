export interface VolumeEvaluationResult {
  score: number; // 0-100
  averageDecibel: number;
  maxDecibel: number;
  feedback: string;
}

/**
 * 최대 성량으로 말하기 평가
 * @param maxDecibel 최대 데시벨 (0-100)
 * @param averageDecibel 평균 데시벨 (0-100)
 * @returns 평가 결과
 */
export function evaluateVolume(maxDecibel: number, averageDecibel: number): VolumeEvaluationResult {
  // 점수 계산: 최대 데시벨 기준 (100dB = 100점 만점)
  let score = Math.round(maxDecibel);

  // 100점 초과 방지
  score = Math.min(100, score);

  // 피드백 생성
  let feedback = '';
  if (score >= 80) {
    feedback = '완벽합니다! 매우 큰 목소리로 발성하셨습니다! 🎉';
  } else if (score >= 70) {
    feedback = '잘하셨습니다! 충분히 큰 목소리입니다! 👍';
  } else if (score >= 60) {
    feedback = '좋습니다! 조금만 더 크게 발성하면 완벽해요! 💪';
  } else if (score >= 50) {
    feedback = '괜찮습니다. 조금 더 큰 목소리로 발성해보세요.';
  } else if (score >= 40) {
    feedback = '목소리가 작습니다. 더 크게 발성해주세요.';
  } else {
    feedback = '소리가 거의 감지되지 않았습니다. 최대한 크게 발성해주세요!';
  }

  return {
    score,
    averageDecibel: Math.round(averageDecibel),
    maxDecibel: Math.round(maxDecibel),
    feedback,
  };
}
