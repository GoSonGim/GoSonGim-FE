import type { Stats, StatsGraph } from '../models';

export interface GetStatsResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    stats: Stats;
    graph: StatsGraph;
  };
}
