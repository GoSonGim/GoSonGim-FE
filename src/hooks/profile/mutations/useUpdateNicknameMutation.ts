import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '@/apis/profile';
import { logger } from '@/utils/common/loggerUtils';
import type { UpdateNicknameRequest } from '@/types/profile';

export const useUpdateNicknameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNicknameRequest) => profileAPI.updateNickname(data),
    onSuccess: (response) => {
      logger.log('✅ Nickname updated:', response.result.nickname);
      // 프로필 쿼리 무효화하여 새 닉네임 반영
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
    onError: (error) => {
      logger.error('❌ Nickname update failed:', error);
    },
  });
};
