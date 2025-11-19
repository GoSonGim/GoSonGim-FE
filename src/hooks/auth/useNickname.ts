import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/common/loggerUtils';

// Mock 데이터 - 이미 사용 중인 닉네임
const MOCK_USED_NICKNAMES = ['또박이', '아끼미', '절약왕'];

export const useNickname = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');

  // 닉네임 변경 핸들러
  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    // 닉네임 검증 (Mock)
    if (MOCK_USED_NICKNAMES.includes(nickname)) {
      alert('이미 사용 중인 닉네임입니다');
      return;
    }

    // 닉네임 설정 완료 - 홈으로 이동
    logger.log('Nickname created:', nickname);
    navigate('/');
  };

  // 다음 버튼 활성화 조건: 1글자 이상 10글자 이하
  const isNextEnabled = nickname.length > 0 && nickname.length <= 10;

  return {
    nickname,
    handleNicknameChange,
    handleNext,
    isNextEnabled,
  };
};
