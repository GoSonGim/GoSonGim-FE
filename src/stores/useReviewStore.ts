import { create } from 'zustand';

type CategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';
type SituationCategoryOption = '전체' | '일상' | '구매' | '의료' | '교통' | '직업' | '사교' | '비상';
type SortOption = '최신순' | '오래된순';

interface ReviewState {
  // 조음 키트 복습 필터
  kitCategory: CategoryOption;
  kitSort: SortOption;

  // 상황극 복습 필터
  situationCategory: SituationCategoryOption;
  situationSort: SortOption;
}

interface ReviewActions {
  setKitCategory: (category: CategoryOption) => void;
  setKitSort: (sort: SortOption) => void;
  setSituationCategory: (category: SituationCategoryOption) => void;
  setSituationSort: (sort: SortOption) => void;
  reset: () => void;
}

const initialState: ReviewState = {
  kitCategory: '전체',
  kitSort: '최신순',
  situationCategory: '전체',
  situationSort: '최신순',
};

export const useReviewStore = create<ReviewState & ReviewActions>((set) => ({
  ...initialState,
  setKitCategory: (category) => set({ kitCategory: category }),
  setKitSort: (sort) => set({ kitSort: sort }),
  setSituationCategory: (category) => set({ situationCategory: category }),
  setSituationSort: (sort) => set({ situationSort: sort }),
  reset: () => set(initialState),
}));
