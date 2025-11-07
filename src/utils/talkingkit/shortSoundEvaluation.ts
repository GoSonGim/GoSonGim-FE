export interface ShortSoundEvaluationResult {
  score: number; // 0-100
  point1Score: number; // 2초 지점
  point2Score: number; // 4초 지점
  point1Timing: number | null;
  point2Timing: number | null;
  point1Accuracy: number; // 오차 (ms)
  point2Accuracy: number;
  feedback: string;
  isSuccess: boolean;
}

/**
 * 짧게 끊어 발성하기 평가
 * @param recordings 발음 시점 배열 (ms)
 * @param targetPoints 목표 지점 [2000, 4000] (ms)
 */
export function evaluateShortSound(
  recordings: number[],
  targetPoints: [number, number] = [2000, 4000],
): ShortSoundEvaluationResult {
  const [target1, target2] = targetPoints;

  // 각 목표 지점에서 가장 가까운 발음 찾기
  const findClosestRecording = (target: number): { timing: number | null; accuracy: number } => {
    if (recordings.length === 0) {
      return { timing: null, accuracy: Infinity };
    }

    let closestTiming: number | null = null;
    let minDiff = Infinity;

    for (const recording of recordings) {
      const diff = Math.abs(recording - target);
      if (diff < minDiff) {
        minDiff = diff;
        closestTiming = recording;
      }
    }

    return { timing: closestTiming, accuracy: minDiff };
  };

  const point1 = findClosestRecording(target1);
  const point2 = findClosestRecording(target2);

  // 점수 계산 함수
  const calculateScore = (accuracy: number): number => {
    if (accuracy >= 1000) return 0;
    // 0~1000ms: 100점 → 50점으로 선형 감소
    return Math.max(0, 100 - (accuracy / 1000) * 50);
  };

  const point1Score = calculateScore(point1.accuracy);
  const point2Score = calculateScore(point2.accuracy);
  const finalScore = Math.round((point1Score + point2Score) / 2);

  // 피드백 생성
  let feedback = '';
  if (finalScore >= 90) {
    feedback = '완벽합니다! 매우 정확하게 발음하셨습니다! 🎉';
  } else if (finalScore >= 75) {
    feedback = '잘하셨습니다! 타이밍이 정확합니다! 👍';
  } else if (finalScore >= 60) {
    feedback = '좋습니다! 조금만 더 연습하면 완벽해요! 💪';
  } else if (finalScore >= 40) {
    feedback = '괜찮습니다. 회색 박스에 공이 정확히 들어올 때 발음해보세요.';
  } else if (recordings.length === 0) {
    feedback = '소리가 감지되지 않았습니다. 더 크게 발음해주세요.';
  } else {
    feedback = '타이밍을 다시 연습해봐요. 회색 박스 위치에서 발음하세요.';
  }

  return {
    score: finalScore,
    point1Score: Math.round(point1Score),
    point2Score: Math.round(point2Score),
    point1Timing: point1.timing,
    point2Timing: point2.timing,
    point1Accuracy: Math.round(point1.accuracy),
    point2Accuracy: Math.round(point2.accuracy),
    feedback,
    isSuccess: finalScore >= 60,
  };
}

/**
 * Scale 애니메이션 크기 계산
 * @param accuracy 오차 (ms)
 * @returns scale 값 (1.0 ~ 1.3)
 */
export function calculateScaleFromAccuracy(accuracy: number): number {
  if (accuracy <= 200) return 1.3; // 매우 정확
  if (accuracy <= 500) return 1.2; // 정확
  if (accuracy <= 1000) return 1.1; // 약간 정확
  return 1.0; // 애니메이션 없음
}
