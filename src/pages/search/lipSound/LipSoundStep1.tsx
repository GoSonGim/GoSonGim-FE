import { useNavigate } from 'react-router-dom';
import Step1Layout from '@/components/talkingkit/layout/Step1Layout';
import MouthIcon from '@/assets/svgs/search/studyfind-mouth.svg';

const LipSoundStep1 = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/search/articulation-position/lip-sound/step2');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Step1Layout
      headerTitle="입술 소리"
      title="근육 강화하기"
      showAction={true}
      guideText="바람을 불어 원의 테두리를 맞춰보세요"
      buttonText="시작하기"
      onButtonClick={handleButtonClick}
      onBackClick={handleBackClick}
    >
      {/* 352px 높이의 컨테이너 */}
      <div className="relative h-[352px] w-full">
        {/* 입 이미지 */}
        <div className="absolute top-[41px] left-[70.5px] size-[216px]">
          <MouthIcon className="h-full w-full" />
        </div>

        {/* 하단 애니메이션 영역 (나중에 애니메이션 추가 가능) */}
        <div className="absolute top-[259px] left-[59.5px] h-[80px] w-[241px]">{/* 애니메이션 placeholder */}</div>
      </div>
    </Step1Layout>
  );
};

export default LipSoundStep1;
