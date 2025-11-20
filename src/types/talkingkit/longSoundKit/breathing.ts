export type BreathingPhase = 'ready' | 'inhale' | 'exhale' | 'complete';

export interface BreathingState {
  phase: BreathingPhase;
  progress: number; // 0-100%
  elapsedTime: number; // 0-10000ms
  ballPosition: { x: number; y: number };
}

export interface BreathingGraphProps {
  phase: BreathingPhase;
  ballPosition: { x: number; y: number };
  setBluePathRef: (element: SVGPathElement | null) => void;
  setRedPathRef: (element: SVGPathElement | null) => void;
}

export interface ProgressBarProps {
  progress: number; // 0-100%
}
