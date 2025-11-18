import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '@/apis/profile';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      console.log('🔵 Calling GET /api/v1/users/me');
      try {
        const response = await profileAPI.getProfile();
        console.log('✅ GET /api/v1/users/me Success:', response);
        return response;
      } catch (error) {
        console.error('❌ GET /api/v1/users/me Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};
