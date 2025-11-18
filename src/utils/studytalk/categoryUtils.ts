// 상황극 카테고리 한글 매핑 (영문 → 한글)
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

// 상황극 카테고리 API 파라미터 변환 (한글 → 영문)
export const getSituationCategoryParam = (category: string): string | undefined => {
  const mapping: Record<string, string | undefined> = {
    전체: undefined,
    일상: 'DAILY',
    구매: 'PURCHASE',
    의료: 'MEDICAL',
    교통: 'TRAFFIC',
    직업: 'JOB',
    사교: 'SOCIAL',
    비상: 'EMERGENCY',
  };
  return mapping[category];
};

// KIT 카테고리 API 파라미터 변환 (한글 → 키트 이름)
export const getKitCategoryParam = (category: string): string | undefined => {
  const mapping: Record<string, string | undefined> = {
    전체: undefined,
    호흡: '호흡 및 발성 기초 키트',
    조음위치: '조음 위치별 연습 키트',
    조음방법: '조음 방식별 연습 키트',
  };
  return mapping[category];
};

// 상황극 카테고리 URL 쿼리 변환 (한글 → 영문 소문자)
export const getSituationCategoryQuery = (category: string): string => {
  const mapping: Record<string, string> = {
    일상: 'daily',
    구매: 'purchase',
    의료: 'medical',
    교통: 'traffic',
    직업: 'job',
    사교: 'social',
    비상: 'emergency',
    DAILY: 'daily',
    PURCHASE: 'purchase',
    MEDICAL: 'medical',
    TRAFFIC: 'traffic',
    JOB: 'job',
    SOCIAL: 'social',
    EMERGENCY: 'emergency',
  };
  return mapping[category] || 'daily';
};

// 짧은 카테고리명 변환 (영문 → 한글)
export const getShortCategoryName = (category: string): string => {
  const mapping: Record<string, string> = {
    DAILY: '일상',
    PURCHASE: '구매',
    MEDICAL: '의료',
    TRAFFIC: '교통',
    JOB: '직업',
    SOCIAL: '사교',
    EMERGENCY: '비상',
  };
  return mapping[category] || category;
};
