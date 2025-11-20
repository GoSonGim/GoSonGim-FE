/**
 * 상황극 ID를 기반으로 준비 화면(SituationDetail) 라우트 경로 생성
 * @param situationId - 상황극 ID
 * @returns 상황극 상세 페이지 라우트 경로
 */
export const getSituationRoute = (situationId: number): string => {
  // situationId → route categoryId 매핑
  const situationCategoryMap: Record<number, string> = {
    1: 'daily-life', // 식당에서 음식 주문하기
    2: 'shopping', // 편의점에서 물건 계산하기
    3: 'medical-service', // 병원에서 증상 설명하기
    4: 'transportation', // 택시 기사에게 목적지 말하기
    5: 'job-education', // 면접에서 자기소개하기
    6: 'social-relationship', // 사교
    7: 'emergency', // 119에 긴급 상황 신고하기
  };

  const categoryId = situationCategoryMap[situationId];
  return `/search/situation/${categoryId}/${situationId}`;
};
