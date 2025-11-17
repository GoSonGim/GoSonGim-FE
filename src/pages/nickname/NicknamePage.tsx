import { NicknameInput } from '@/components/auth/NicknameInput';
import { NextButton } from '@/components/auth/NextButton';
import { useNickname } from '@/hooks/auth/useNickname';

const NicknamePage = () => {
  const { nickname, handleNicknameChange, handleNext, isNextEnabled } = useNickname();

  return (
    <div className="relative h-screen w-full bg-white">
      {/* 타이틀 및 서브타이틀 */}
      <div className="absolute top-[128px] left-4 flex w-[361px] flex-col gap-2">
        <p className="text-detail-01 text-gray-60">반갑습니다!</p>
        <h1 className="text-[24px] leading-[1.2] font-bold text-gray-100">
          또박에서 사용할
          <br />
          닉네임을 생성해주세요
        </h1>
      </div>

      {/* Nickname Input */}
      <div className="absolute top-[230px] left-4 w-[361px]">
        <NicknameInput
          label="닉네임"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="10글자 이내로 닉네임을 생성해주세요"
          maxLength={10}
        />
      </div>

      {/* 다음 버튼 (화면 하단 고정) */}
      <div className="absolute bottom-[94px] left-1/2 w-[361px] -translate-x-1/2">
        <NextButton onClick={handleNext} disabled={!isNextEnabled}>
          다음
        </NextButton>
      </div>
    </div>
  );
};

export default NicknamePage;
