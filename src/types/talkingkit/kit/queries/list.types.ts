import type { Kit } from '../models';

// ===== Kit List =====
export interface KitListResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    count: number;
    kits: Kit[];
  };
}

