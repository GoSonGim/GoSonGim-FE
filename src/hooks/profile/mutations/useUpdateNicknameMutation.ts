import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '@/apis/profile';
import type { UpdateNicknameRequest } from '@/types/profile';

export const useUpdateNicknameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNicknameRequest) => profileAPI.updateNickname(data),
    onSuccess: (response) => {
      console.log('✅ Nickname updated:', response.result.nickname);
      // 프로필 쿼리 무효화하여 새 닉네임 반영
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
    onError: (error) => {
      console.error('❌ Nickname update failed:', error);
    },
  });
};
