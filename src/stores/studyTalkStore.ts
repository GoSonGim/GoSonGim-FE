import { create } from 'zustand';

interface StudyTalkStore {
  removedKits: number[];
  removeKit: (id: number) => void;
  restoreAllKits: () => void;
  removedSituationKits: number[];
  removeSituationKit: (id: number) => void;
  restoreAllSituationKits: () => void;
}

export const useStudyTalkStore = create<StudyTalkStore>((set) => ({
  removedKits: [],

  removeKit: (id) =>
    set((state) => ({
      removedKits: [...state.removedKits, id],
    })),

  restoreAllKits: () =>
    set(() => ({
      removedKits: [],
    })),

  removedSituationKits: [],

  removeSituationKit: (id) =>
    set((state) => ({
      removedSituationKits: [...state.removedSituationKits, id],
    })),

  restoreAllSituationKits: () =>
    set(() => ({
      removedSituationKits: [],
    })),
}));
