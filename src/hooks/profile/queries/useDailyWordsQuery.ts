import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '@/apis/profile';
import type { GetDailyWordsRequest } from '@/types/profile';

export const useDailyWordsQuery = (params?: GetDailyWordsRequest) => {
  return useQuery({
    queryKey: ['profile', 'dailyWords', params?.page, params?.size],
    queryFn: async () => {
      console.log('🔵 Calling GET /api/v1/users/me/stats/daily-words');
      try {
        const response = await profileAPI.getDailyWords(params);
        console.log('✅ GET /api/v1/users/me/stats/daily-words Success:', response);
        return response;
      } catch (error) {
        console.error('❌ GET /api/v1/users/me/stats/daily-words Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};
