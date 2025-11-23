interface ParsedFeedback {
  accuracy: number;
  fluency: number;
  completeness: number;
  prosody: number;
}

/**
 * evaluationFeedback 문자열을 파싱하여 객체로 반환
 * @param feedback - "정확도: 92.0, 유창성: 100.0, 완성도: 100.0, 운율: 95.2" 형식의 문자열
 * @returns 파싱된 점수 객체
 */
export const parseFeedback = (feedback: string): ParsedFeedback => {
  const accuracyMatch = feedback.match(/정확도:\s*([\d.]+)/);
  const fluencyMatch = feedback.match(/유창성:\s*([\d.]+)/);
  const completenessMatch = feedback.match(/완성도:\s*([\d.]+)/);
  const prosodyMatch = feedback.match(/운율:\s*([\d.]+)/);

  return {
    accuracy: accuracyMatch ? parseFloat(accuracyMatch[1]) : 0,
    fluency: fluencyMatch ? parseFloat(fluencyMatch[1]) : 0,
    completeness: completenessMatch ? parseFloat(completenessMatch[1]) : 0,
    prosody: prosodyMatch ? parseFloat(prosodyMatch[1]) : 0,
  };
};

/**
 * 여러 레코드의 evaluationFeedback 평균을 계산
 * @param feedbacks - evaluationFeedback 문자열 배열
 * @returns 평균 피드백 문자열
 */
export const calculateAverageFeedback = (feedbacks: string[]): string => {
  if (feedbacks.length === 0) return '피드백이 없습니다';

  const totals = feedbacks.reduce(
    (acc, feedback) => {
      const parsed = parseFeedback(feedback);
      return {
        accuracy: acc.accuracy + parsed.accuracy,
        fluency: acc.fluency + parsed.fluency,
        completeness: acc.completeness + parsed.completeness,
        prosody: acc.prosody + parsed.prosody,
      };
    },
    { accuracy: 0, fluency: 0, completeness: 0, prosody: 0 },
  );

  const count = feedbacks.length;
  return `정확도: ${(totals.accuracy / count).toFixed(1)}, 유창성: ${(totals.fluency / count).toFixed(1)}, 완성도: ${(totals.completeness / count).toFixed(1)}, 운율: ${(totals.prosody / count).toFixed(1)}`;
};
