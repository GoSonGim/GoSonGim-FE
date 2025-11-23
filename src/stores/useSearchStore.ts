import { create } from 'zustand';

type TabType = '조음발음' | '상황극';

interface SearchState {
  activeTab: TabType;
}

interface SearchActions {
  setActiveTab: (tab: TabType) => void;
  reset: () => void;
}

const initialState: SearchState = {
  activeTab: '조음발음',
};

export const useSearchStore = create<SearchState & SearchActions>((set) => ({
  ...initialState,
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set(initialState),
}));
