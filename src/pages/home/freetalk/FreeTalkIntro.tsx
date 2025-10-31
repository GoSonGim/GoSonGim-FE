import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';

export default function FreeTalkIntro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/freetalk/chat');
  };

  return (
    <div className="relative bg-background-primary flex h-full flex-col">
      {/* Header */}
      <div className="bg-white h-16 flex items-center overflow-clip px-0 py-[8px] relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-[8px] size-[48px] absolute left-[16px] cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[10px]" />
        </button>
        <p className="text-[20px] font-normal leading-[1.5] text-gray-100 text-center absolute left-1/2 -translate-x-1/2">
          자유대화
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-[16px] pt-[72px]">
        <div className="flex flex-col gap-[16px] items-center w-[361px]">
          {/* 아바타 영상 플레이스홀더 */}
          <div className="bg-white box-border flex items-center justify-center h-[224px] rounded-[16px] w-full">
            <p className="text-[18px] font-medium leading-[1.5] text-gray-100 text-center">
              아바타 영상
            </p>
          </div>

          {/* 설명 텍스트 박스 */}
          <div className="bg-white border border-[#9aadff] box-border flex items-center justify-center px-[24px] py-[16px] rounded-[16px]">
            <div className="text-[18px] font-semibold leading-[1.5] text-[#3c434f] text-center">
              <p className="mb-0">AI와의 자유대화가 진행됩니다.</p>
              <p className="mb-0">문장의 맥락을 듣고 </p>
              <p>적절한 답변을 진행해주세요</p>
            </div>
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <button
          onClick={handleStart}
          className="bg-[#4c5eff] flex items-center justify-center h-[48px] w-[288px] rounded-full mt-[115px] cursor-pointer"
        >
          <p className="text-[20px] font-semibold leading-[1.5] text-white text-center">
            시작하기
          </p>
        </button>
      </main>
    </div>
  );
}
