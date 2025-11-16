/**
 * 상황극 카테고리 ID를 API 쿼리 파라미터로 변환
 */
export const getSituationCategoryQuery = (categoryId: string): string => {
  const categoryMap: Record<string, string> = {
    'daily-life': 'daily',
    shopping: 'purchase',
    'medical-service': 'medical',
    transportation: 'traffic',
    'job-education': 'job',
    'social-relationship': 'social',
    emergency: 'emergency',
  };

  return categoryMap[categoryId] || 'daily';
};

/**
 * API 쿼리 파라미터를 카테고리 ID로 변환
 */
export const getSituationCategoryId = (categoryQuery: string): string => {
  const queryMap: Record<string, string> = {
    daily: 'daily-life',
    purchase: 'shopping',
    medical: 'medical-service',
    traffic: 'transportation',
    job: 'job-education',
    social: 'social-relationship',
    emergency: 'emergency',
  };

  return queryMap[categoryQuery] || 'daily-life';
};

/**
 * 카테고리 ID로 카테고리 제목 가져오기
 */
export const getSituationCategoryTitle = (categoryId: string): string => {
  const titleMap: Record<string, string> = {
    'daily-life': '일상생활 및 가정',
    shopping: '구매 및 쇼핑',
    'medical-service': '의료•공공 서비스',
    transportation: '교통 및 길찾기',
    'job-education': '직업 및 교육',
    'social-relationship': '사교 및 관계',
    emergency: '비상 및 문제해결',
  };

  return titleMap[categoryId] || '일상생활 및 가정';
};
