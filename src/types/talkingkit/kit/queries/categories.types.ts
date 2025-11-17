import type { KitCategory } from '../models';

// ===== Kit Category =====
export interface KitCategoryResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    count: number;
    categories: KitCategory[];
  };
}

