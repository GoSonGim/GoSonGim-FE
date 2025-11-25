import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Turn, FinalSummary } from '@/types/situation';

interface SituationSessionState {
  sessionId: string | null;
  situationId: number | null;
  situationName: string | null;
  currentTurnIndex: number;
  turns: Turn[];
  currentQuestion: string;
  shouldRestoreSession: boolean;
  isLastTurn: boolean;
  finalSummary: FinalSummary | null;
}

interface SituationSessionActions {
  saveSession: (data: {
    sessionId: string;
    situationId: number;
    situationName: string;
    currentTurnIndex: number;
    turns: Turn[];
    currentQuestion: string;
    isLastTurn?: boolean;
    finalSummary?: FinalSummary | null;
  }) => void;
  clearSession: () => void;
  setShouldRestore: (shouldRestore: boolean) => void;
}

type SituationSessionStore = SituationSessionState & SituationSessionActions;

export const useSituationSessionStore = create<SituationSessionStore>()(
  persist(
    (set) => ({
      // State
      sessionId: null,
      situationId: null,
      situationName: null,
      currentTurnIndex: 0,
      turns: [],
      currentQuestion: '',
      shouldRestoreSession: false,
      isLastTurn: false,
      finalSummary: null,

      // Actions
      saveSession: (data) =>
        set({
          sessionId: data.sessionId,
          situationId: data.situationId,
          situationName: data.situationName,
          currentTurnIndex: data.currentTurnIndex,
          turns: data.turns,
          currentQuestion: data.currentQuestion,
          shouldRestoreSession: false,
          isLastTurn: data.isLastTurn ?? false,
          finalSummary: data.finalSummary ?? null,
        }),

      clearSession: () =>
        set({
          sessionId: null,
          situationId: null,
          situationName: null,
          currentTurnIndex: 0,
          turns: [],
          currentQuestion: '',
          shouldRestoreSession: false,
          isLastTurn: false,
          finalSummary: null,
        }),

      setShouldRestore: (shouldRestore) =>
        set({
          shouldRestoreSession: shouldRestore,
        }),
    }),
    {
      name: 'situation-session-storage',
    },
  ),
);
