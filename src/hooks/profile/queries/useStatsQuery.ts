import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '@/apis/profile';
import { logger } from '@/utils/common/loggerUtils';

export const useStatsQuery = () => {
  return useQuery({
    queryKey: ['profile', 'stats'],
    queryFn: async () => {
      logger.log('🔵 Calling GET /api/v1/users/me/stats');
      try {
        const response = await profileAPI.getStats();
        logger.log('✅ GET /api/v1/users/me/stats Success:', response);
        return response;
      } catch (error) {
        logger.error('❌ GET /api/v1/users/me/stats Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};
