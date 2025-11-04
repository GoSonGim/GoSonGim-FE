import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svgs/home/leftarrow.svg';

export default function FreeTalkIntro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/freetalk/chat');
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* Header */}
      <div className="relative flex h-16 items-center overflow-clip bg-white px-0 py-[8px]">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-[16px] flex size-[48px] cursor-pointer items-center justify-center p-[8px]"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-[18px] w-[10px]" />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-center text-[20px] leading-normal font-normal text-gray-100">
          자유대화
        </p>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-[16px] pt-[72px]">
        <div className="flex w-[361px] flex-col items-center gap-[16px]">
          {/* 아바타 영상 플레이스홀더 */}
          <div className="box-border flex h-[224px] w-full items-center justify-center rounded-[16px] bg-white">
            <p className="text-center text-[18px] leading-normal font-medium text-gray-100">아바타 영상</p>
          </div>

          {/* 설명 텍스트 박스 */}
          <div className="border-blue-2 box-border flex items-center justify-center rounded-[16px] border bg-white px-[24px] py-[16px]">
            <div className="text-gray-80 text-center text-[18px] leading-normal font-semibold">
              <p className="mb-0">AI와의 자유대화가 진행됩니다.</p>
              <p className="mb-0">문장의 맥락을 듣고 </p>
              <p>적절한 답변을 진행해주세요</p>
            </div>
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <button
          onClick={handleStart}
          className="bg-blue-1 mt-[115px] flex h-[48px] w-[288px] cursor-pointer items-center justify-center rounded-full"
        >
          <p className="text-center text-[20px] leading-normal font-semibold text-white">시작하기</p>
        </button>
      </main>
    </div>
  );
}
