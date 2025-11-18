import type { User } from '../models';

export interface GetProfileResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    user: User;
  };
}
