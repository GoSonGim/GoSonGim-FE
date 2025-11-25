import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import LeftIcon from '@/assets/svgs/review/review-leftarrow.svg';
import RightIcon from '@/assets/svgs/review/review-rightarrow.svg';
import RestudyIcon from '@/assets/svgs/review/review-restudy.svg';
import AudioIcon from '@/assets/svgs/review/review-audio.svg';
import TodayIcon from '@/assets/svgs/review/review-todayicon.svg';
import { useCalendar } from '@/hooks/review/calendar';
import { getKitRoute } from '@/utils/review/kitRouteUtils';
import { getSituationRoute } from '@/utils/review/situationRouteUtils';
import type { DailyStudyItem } from '@/types/review';
import { WEEKDAYS } from '@/constants/review/calendar';

const ReviewCalendar = () => {
  const navigate = useNavigate();
  const {
    selectedDate,
    calendarDays,
    formatYearMonth,
    formatDate,
    isToday,
    isSelected,
    hasKits,
    getKitsForDate,
    goToPrevMonth,
    goToNextMonth,
    handleDateClick,
  } = useCalendar();

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 헤더 */}
      <header className="flex h-16 items-center justify-center bg-white px-4">
        <button onClick={() => navigate('/review')} className="absolute left-4 cursor-pointer p-2">
          <LeftIcon className="h-[18px] w-[10px]" />
        </button>
        <h1 className="text-heading-02-regular text-gray-100">날짜별 학습 기록</h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto pt-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 날짜 네비게이션 + 캘린더 그리드 통합 박스 */}
        <div className="bg-white">
          {/* 달력 네비게이션 */}
          <div className="flex h-[59px] items-center justify-center gap-4 px-4">
            <button onClick={goToPrevMonth} className="flex cursor-pointer items-center justify-center">
              <LeftIcon className="h-[18px] w-[10px]" />
            </button>
            <p className="text-body-01-semibold text-gray-100">{formatYearMonth()}</p>
            <button onClick={goToNextMonth} className="flex cursor-pointer items-center justify-center">
              <RightIcon className="h-[18px] w-[10px]" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="border-gray-10 flex border-b">
            {WEEKDAYS.map((day, index) => (
              <div key={day} className="flex flex-1 items-center justify-center p-1">
                <p
                  className={`text-detail-02 ${
                    index === 0 ? 'text-[#ff7b9b]' : index === 6 ? 'text-[#95a3ff]' : 'text-gray-60'
                  }`}
                >
                  {day}
                </p>
              </div>
            ))}
          </div>

          {/* 날짜 그리드 - 56x56 타일 */}
          <div className="grid grid-cols-7 px-2">
            {calendarDays.map((day, index) => {
              const today = isToday(day.fullDate);
              const selected = isSelected(day.fullDate);
              const studied = hasKits(day.fullDate);
              const currentMonth = day.isCurrentMonth;

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.fullDate)}
                  className={clsx(
                    'cursor-pointer',
                    'flex h-14 w-full flex-col items-center justify-start gap-2 p-1',
                    selected && 'from-blue-1 to-blue-2 bg-linear-to-t',
                    !selected && 'hover:bg-gray-5 bg-white',
                  )}
                >
                  {/* 오늘 - 선택되지 않았을 때: 파란 원 + 흰색 날짜 */}
                  {today && !selected && (
                    <div className="relative flex items-center justify-center">
                      <TodayIcon className="h-[18px] w-[18px]" />
                      <span className="text-detail-02 absolute text-white">{day.date}</span>
                    </div>
                  )}

                  {/* 오늘 - 선택되었을 때: 하얀 원 + 파란 글씨 */}
                  {today && selected && (
                    <div className="relative flex items-center justify-center">
                      <div className="h-[18px] w-[18px] rounded-full bg-white" />
                      <span className="text-detail-02 text-blue-1 absolute">{day.date}</span>
                    </div>
                  )}

                  {/* 일반 날짜 */}
                  {!today && (
                    <span
                      className={clsx(
                        'text-detail-02',
                        selected && 'text-white',
                        !selected && currentMonth && 'text-gray-100',
                        !selected && !currentMonth && 'text-gray-30',
                      )}
                    >
                      {day.date}
                    </span>
                  )}

                  {/* 학습한 날 점 - 현재 달의 날짜에만 표시 */}
                  {studied && currentMonth && (
                    <div
                      className={clsx('h-2 w-2 shrink-0 rounded-full', selected ? 'bg-white' : 'bg-blue-1')}
                      style={{ backgroundColor: !selected ? '#4C5EFF' : undefined }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 학습 내역 섹션 - 별도 영역 */}
        {selectedDate && (
          <>
            {/* 날짜 제목 - 배경색에 표시 */}
            <div className="mt-4 flex items-center gap-4 px-4">
              <div className="bg-blue-1 h-6 w-0.5" />
              <h2 className="text-heading-01 text-gray-100">{formatDate(selectedDate)}</h2>
            </div>

            {/* 학습 키트 목록 - 흰색 박스 */}
            {getKitsForDate(selectedDate).length > 0 && (
              <div className="mt-4 flex flex-col bg-white">
                {/* 테이블 헤더 */}
                <div className="border-gray-10 flex items-center justify-between border-b bg-[#F2F6FA] px-4 py-2">
                  <p className="text-body-02-regular text-gray-50">키트 종류</p>
                  <div className="text-body-02-regular flex gap-[14px] text-gray-50">
                    <p>재학습</p>
                    <p>녹음 듣기</p>
                  </div>
                </div>

                {/* 키트 리스트 */}
                {getKitsForDate(selectedDate).map((item: DailyStudyItem, index: number) => {
                  const handleRestudy = () => {
                    if (item.type === 'SITUATION') {
                      navigate(getSituationRoute(item.id));
                    } else {
                      navigate(getKitRoute(item.name));
                    }
                  };

                  const handleListen = () => {
                    if (item.type === 'SITUATION') {
                      navigate(`/review/practice/listen?recordingId=${item.recordingId}`);
                    } else {
                      // kit 타입 - 조음 키트 (recordingId로 일별 학습 세션 조회)
                      navigate(`/review/practice/articulation-listen?recordingId=${item.recordingId}`);
                    }
                  };

                  return (
                    <div
                      key={`${item.type}-${item.id}-${index}`}
                      className="border-gray-10 flex h-20 items-center justify-between border-b bg-white px-4"
                    >
                      <p className="text-heading-02-semibold text-gray-100">{item.name}</p>
                      <div className="flex gap-4">
                        {/* 재학습 버튼 */}
                        <button
                          onClick={handleRestudy}
                          className="border-gray-20 bg-background-primary flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border"
                        >
                          <RestudyIcon className="h-[52px] w-[52px]" />
                        </button>
                        {/* 녹음 듣기 버튼 */}
                        <button
                          onClick={handleListen}
                          className="border-blue-3 flex size-[52px] cursor-pointer items-center justify-center rounded-2xl border bg-white"
                        >
                          <AudioIcon className="h-[52px] w-[52px]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
export default ReviewCalendar;
