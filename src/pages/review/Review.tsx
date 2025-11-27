import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import BlueArrow from '@/assets/svgs/review/review-bluearrow.svg';
import WhiteArrow from '@/assets/svgs/review/review-whitearrow.svg';
import CalendarIcon from '@/assets/svgs/review/review-calendar.svg';

// 대용량 SVG를 URL로 import하여 브라우저 네이티브 lazy loading 사용
import MikeIconUrl from '@/assets/svgs/review/review-mike.svg?url';
import PeopleIconUrl from '@/assets/svgs/review/review-peopleIcon.svg?url';

const Review = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<'quiz' | 'all' | null>(null);

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex h-16 items-center justify-between bg-white px-4 py-2">
        <div className="flex items-center justify-center px-4 py-0">
          <h1 className="text-[24px] leading-normal font-medium text-gray-100">복습</h1>
        </div>
        <button className="cursor-pointer" onClick={() => navigate('/review/calendar')}>
          <CalendarIcon className="h-[48px] w-[48px]" />
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-hidden px-4 pt-10 pb-40 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 단어 복습 카드 섹션 */}
        <div className="mb-10 flex flex-col gap-2">
          {/* 단어복습 랜덤퀴즈 카드 */}
          <div
            className={`border-blue-2 flex h-[88px] cursor-pointer items-center justify-between rounded-2xl border p-4 shadow-lg transition-colors ${
              hoveredCard === 'quiz' ? 'bg-blue-1' : 'bg-white'
            }`}
            onMouseEnter={() => setHoveredCard('quiz')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/review/word-quiz')}
          >
            <div className="flex w-[232px] flex-col gap-0">
              <p
                className={`text-detail-01 transition-colors ${
                  hoveredCard === 'quiz' ? 'text-gray-20' : 'text-gray-60'
                }`}
              >
                발음을 성공했던 단어들이 랜덤으로 나와요
              </p>
              <p
                className={`text-heading-01 transition-colors ${
                  hoveredCard === 'quiz' ? 'text-white' : 'text-gray-100'
                }`}
              >
                단어복습 랜덤퀴즈
              </p>
            </div>
            <button
              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors ${
                hoveredCard === 'quiz' ? 'bg-white' : 'bg-blue-2'
              }`}
            >
              {hoveredCard === 'quiz' ? <WhiteArrow className="h-20 w-20" /> : <BlueArrow className="h-20 w-20" />}
            </button>
          </div>

          {/* 학습한 단어 모두보기 카드 */}
          <div
            className={`border-blue-2 flex h-[88px] cursor-pointer items-center justify-between rounded-2xl border p-4 shadow-lg transition-colors ${
              hoveredCard === 'all' ? 'bg-blue-1' : 'bg-white'
            }`}
            onMouseEnter={() => setHoveredCard('all')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/review/word-list')}
          >
            <div className="flex w-[232px] flex-col gap-0">
              <p
                className={`text-detail-01 transition-colors ${
                  hoveredCard === 'all' ? 'text-gray-20' : 'text-gray-60'
                }`}
              >
                이전에 학습한 단어를 확인해보세요
              </p>
              <p
                className={`text-heading-01 transition-colors ${
                  hoveredCard === 'all' ? 'text-white' : 'text-gray-100'
                }`}
              >
                학습한 단어 모두보기
              </p>
            </div>
            <button
              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors ${
                hoveredCard === 'all' ? 'bg-white' : 'bg-blue-2'
              }`}
            >
              {hoveredCard === 'all' ? <WhiteArrow className="h-20 w-20" /> : <BlueArrow className="h-20 w-20" />}
            </button>
          </div>
        </div>

        {/* 학습 복습 카드 섹션 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 조음·발음 복습하기 카드 */}
          <div
            className="border-gray-20 flex h-64 cursor-pointer flex-col justify-between rounded-2xl border bg-white p-4 shadow-lg"
            onClick={() => navigate('/review/practice?type=articulation')}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="text-heading-01 whitespace-nowrap text-gray-100">조음·발음</p>
                <p className="text-heading-01 whitespace-nowrap text-gray-100">복습하기</p>
              </div>
              <p className="text-detail-02 text-gray-60 leading-normal">
                이전에 학습한 조음·발음 키트를 다시 해볼 수 있어요!
              </p>
            </div>
            <div className="flex justify-end">
              <img src={MikeIconUrl} alt="마이크 아이콘" className="h-[62px] w-[62px]" loading="lazy" />
            </div>
          </div>

          {/* 상황극 복습하기 카드 */}
          <div
            className="border-gray-20 relative flex h-64 cursor-pointer flex-col rounded-2xl border bg-white p-4 shadow-lg"
            onClick={() => navigate('/review/practice?type=roleplay')}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="text-heading-01 whitespace-nowrap text-gray-100">상황극</p>
                <p className="text-heading-01 whitespace-nowrap text-gray-100">복습하기</p>
              </div>
              <p className="text-detail-02 text-gray-60 leading-normal">
                이전에 학습한 상황극 연습을 다시 해볼 수 있어요!
              </p>
            </div>
            <div className="absolute right-4 bottom-4">
              <img src={PeopleIconUrl} alt="사람 아이콘" className="h-[65px] w-[70px]" loading="lazy" />
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Review;
