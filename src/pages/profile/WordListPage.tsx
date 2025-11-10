import { useNavigate } from 'react-router-dom';
import LeftIcon from '@/assets/svgs/profile/profilehome/review-leftarrow.svg';
import { MOCK_WORD_LIST, TOTAL_STUDY_COUNT } from '@/mock/profile/wordList.mock';

const WordListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex h-16 items-center justify-center bg-white px-4">
        <button onClick={() => navigate('/profile')} className="absolute left-4 p-2">
          <LeftIcon className="h-[18px] w-[10px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">날짜별 학습 단어 보기</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="relative flex-1 overflow-y-auto pt-3 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 흰색 박스 */}
        <div className="bg-white pt-16 pb-4">
          {/* 총 학습 횟수 */}
          <div className="absolute top-[29px] right-[16px]">
            <p className="text-body-01-semibold text-gray-100">
              <span className="text-[16px]">총 </span>
              <span className="text-[18px]">{TOTAL_STUDY_COUNT}</span>
              <span className="text-[16px]">회</span>
            </p>
          </div>

          {/* 단어 리스트 */}
          <div className="flex flex-col">
            {MOCK_WORD_LIST.map((item, index) => (
              <div key={index} className="relative">
                {/* 날짜와 개수 */}
                <div className="relative h-[34px]">
                  {/* 날짜 */}
                  <p className="absolute left-[24px] text-[18px] leading-[1.4] font-semibold text-gray-100">
                    {item.date}
                  </p>
                  {/* 개수 */}
                  <p className="absolute right-[16px] text-gray-100">
                    <span className="text-[18px] font-semibold">{item.count}</span>
                    <span className="text-[16px] font-semibold">개</span>
                  </p>
                </div>

                {/* 구분선 */}
                <div className="mx-4 border-b border-gray-100" />

                {/* 단어 목록 박스 */}
                <div className="bg-background-primary mx-[15px] mt-[9px] mb-[43px] h-[64px] rounded-lg px-[11px] py-[10px]">
                  <p className="text-[16px] leading-[1.4] text-gray-100">{item.words.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WordListPage;
