import { create } from 'zustand';

type TabType = '조음발음' | '상황극';
type CategoryOption = '전체' | '호흡' | '조음위치' | '조음방법';
type SituationCategoryOption = '전체' | '일상' | '구매' | '의료' | '교통' | '직업' | '사교' | '비상';
type SortOption = '최신순' | '오래된순';

interface StudyTalkState {
  // 탭
  activeTab: TabType;

  // 조음발음 연습 필터
  selectedCategory: CategoryOption;
  selectedSort: SortOption;

  // 상황극 연습 필터
  selectedSituationCategory: SituationCategoryOption;
  selectedSituationSort: SortOption;
}

interface StudyTalkActions {
  setActiveTab: (tab: TabType) => void;
  setCategory: (category: CategoryOption) => void;
  setSort: (sort: SortOption) => void;
  setSituationCategory: (category: SituationCategoryOption) => void;
  setSituationSort: (sort: SortOption) => void;
  reset: () => void;
}

const initialState: StudyTalkState = {
  activeTab: '조음발음',
  selectedCategory: '전체',
  selectedSort: '최신순',
  selectedSituationCategory: '전체',
  selectedSituationSort: '최신순',
};

export const useStudyTalkStore = create<StudyTalkState & StudyTalkActions>((set) => ({
  ...initialState,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCategory: (category) => set({ selectedCategory: category }),
  setSort: (sort) => set({ selectedSort: sort }),
  setSituationCategory: (category) => set({ selectedSituationCategory: category }),
  setSituationSort: (sort) => set({ selectedSituationSort: sort }),
  reset: () => set(initialState),
}));
