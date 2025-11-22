import type { KitReviewItem } from '@/types/review';
import type { KitCategoryOption } from '@/constants/review/sort';

/**
 * 키트 목록을 카테고리로 필터링
 */
export const filterKitsByCategory = (kits: KitReviewItem[], category: KitCategoryOption): KitReviewItem[] => {
  if (category === '전체') return kits;

  return kits.filter((kit) => matchesCategory(kit, category));
};

/**
 * 키트가 특정 카테고리와 매칭되는지 확인
 */
const matchesCategory = (kit: KitReviewItem, category: KitCategoryOption): boolean => {
  const kitNameLower = kit.kitName.toLowerCase();
  const kitCategoryLower = kit.kitCategory ? kit.kitCategory.toLowerCase() : '';

  switch (category) {
    case '호흡':
      return matchesBreathCategory(kitNameLower, kitCategoryLower);
    case '조음위치':
      return matchesPlaceCategory(kitNameLower, kitCategoryLower);
    case '조음방법':
      return matchesMannerCategory(kitNameLower, kitCategoryLower);
    default:
      return true;
  }
};

/**
 * 호흡 카테고리 매칭
 */
const matchesBreathCategory = (kitNameLower: string, kitCategoryLower: string): boolean => {
  // 키트 카테고리로 확인
  const isCategoryMatch = kitCategoryLower && (kitCategoryLower.includes('호흡') || kitCategoryLower === 'breath');

  // 키트 이름으로 확인
  const kitNameNoSpace = kitNameLower.replace(/\s/g, '');
  const isNameMatch =
    kitNameNoSpace.includes('길게소리내기') ||
    kitNameNoSpace.includes('일정한소리내기') ||
    kitNameLower.includes('큰소리내기');

  return isCategoryMatch || isNameMatch;
};

/**
 * 조음위치 카테고리 매칭
 */
const matchesPlaceCategory = (kitNameLower: string, kitCategoryLower: string): boolean => {
  // 키트 카테고리로 확인
  const isCategoryMatch =
    kitCategoryLower &&
    (kitCategoryLower.includes('조음 위치') || kitCategoryLower.includes('조음위치') || kitCategoryLower === 'place');

  // 키트 이름으로 확인
  const kitNameNoSpace = kitNameLower.replace(/\s/g, '');
  const isNameMatch =
    kitNameNoSpace.includes('입술소리') ||
    kitNameLower.includes('입술 소리') ||
    kitNameNoSpace.includes('혀끝소리') ||
    kitNameLower.includes('혀끝 소리') ||
    kitNameNoSpace.includes('목구멍소리') ||
    kitNameLower.includes('목구멍 소리') ||
    kitNameNoSpace.includes('잇몸소리') ||
    kitNameLower.includes('잇몸 소리');

  return isCategoryMatch || isNameMatch;
};

/**
 * 조음방법 카테고리 매칭
 */
const matchesMannerCategory = (kitNameLower: string, kitCategoryLower: string): boolean => {
  // 키트 카테고리로 확인
  const isCategoryMatch =
    kitCategoryLower &&
    (kitCategoryLower.includes('조음 방법') || kitCategoryLower.includes('조음방법') || kitCategoryLower === 'manner');

  // 키트 이름으로 확인
  const isNameMatch =
    kitNameLower.includes('파열음') ||
    kitNameLower.includes('마찰음') ||
    kitNameLower.includes('유음') ||
    kitNameLower.includes('비음') ||
    kitNameLower.includes('유음/비음') ||
    kitNameLower.includes('턱 움직임') ||
    kitNameLower.replace(/\s/g, '').includes('턱움직임');

  return isCategoryMatch || isNameMatch;
};
