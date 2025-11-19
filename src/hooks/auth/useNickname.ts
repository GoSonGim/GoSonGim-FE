import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateNicknameMutation } from '@/hooks/profile/mutations/useUpdateNicknameMutation';
import { logger } from '@/utils/common/loggerUtils';

export const useNickname = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const updateNicknameMutation = useUpdateNicknameMutation();

  // 닉네임 변경 핸들러
  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = async () => {
    if (!nickname.trim()) {
      return;
    }

    try {
      await updateNicknameMutation.mutateAsync({ nickname });
      // 닉네임 설정 완료 - 홈으로 이동
      navigate('/');
    } catch (error) {
      logger.error('Nickname update failed:', error);
      // 에러는 mutation의 onError에서 처리됨
    }
  };

  // 다음 버튼 활성화 조건: 1글자 이상 10글자 이하, 로딩 중이 아닐 때
  const isNextEnabled = nickname.trim().length > 0 && nickname.length <= 10 && !updateNicknameMutation.isPending;

  return {
    nickname,
    handleNicknameChange,
    handleNext,
    isNextEnabled,
  };
};
