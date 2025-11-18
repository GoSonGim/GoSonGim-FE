// 상황극 카테고리 한글 매핑
export const getSituationCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    SOCIAL: '사교',
    TRAFFIC: '교통',
    JOB: '직업',
    EMERGENCY: '비상',
    MEDICAL: '의료',
    PURCHASE: '구매',
    DAILY: '일상',
  };

  return categoryMap[category] || category;
};
