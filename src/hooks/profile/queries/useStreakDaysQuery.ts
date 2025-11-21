import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '@/apis/profile';

export const useStreakDaysQuery = () => {
  return useQuery({
    queryKey: ['streakDays'],
    queryFn: profileAPI.getStreakDays,
  });
};
