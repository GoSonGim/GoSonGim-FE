import { useState } from 'react';
import { useMonthlyStudyQuery } from '../queries/useMonthlyStudyQuery';
import { useDailyStudyQuery } from '../queries/useDailyStudyQuery';
import type { DailyStudyItem } from '@/types/review';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 날짜 형식 변환 유틸
  const formatToYearMonth = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const formatToYearMonthDay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // API 호출
  const monthString = formatToYearMonth(currentDate);
  const selectedDateString = selectedDate ? formatToYearMonthDay(selectedDate) : null;

  const { data: monthlyData } = useMonthlyStudyQuery(monthString);
  const { data: dailyData } = useDailyStudyQuery(selectedDateString);

  // 현재 월의 첫날과 마지막날
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 시작 요일 (0: 일요일)
  const startDay = firstDay.getDay();

  // 마지막 날짜
  const lastDate = lastDay.getDate();

  // 이전 달의 마지막 날
  const prevLastDay = new Date(year, month, 0);
  const prevLastDate = prevLastDay.getDate();

  // 날짜 그리드 생성
  const generateCalendarDays = () => {
    const days: Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }> = [];

    // 이전 달 날짜
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: prevLastDate - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevLastDate - i),
      });
    }

    // 현재 달 날짜
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

    // 다음 달 날짜 (42칸 맞추기 - 6주)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  // 날짜 포맷팅
  const formatYearMonth = () => {
    return `${year}년 ${month + 1}월`;
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear().toString().slice(2);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // 특정 날짜의 학습 항목 목록 조회
  const getKitsForDate = (date: Date): DailyStudyItem[] => {
    if (!selectedDate || !dailyData?.result?.items) return [];

    // 선택된 날짜와 일치하는지 확인
    const isSelectedDate =
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();

    return isSelectedDate ? dailyData.result.items : [];
  };

  // 학습 기록이 있는지 확인 (월별 API의 days 배열 확인)
  const hasKits = (date: Date): boolean => {
    if (!monthlyData?.result?.days) return false;

    // API가 숫자 배열(일자만)을 반환하므로 date.getDate()와 비교
    const dayNumber = date.getDate();
    return monthlyData.result.days.includes(dayNumber);
  };

  // 오늘 날짜인지 확인
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 선택된 날짜인지 확인
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 월 변경
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 날짜 선택
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    // 선택한 날짜가 현재 보고 있는 월과 다르면 해당 월로 이동
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  return {
    currentDate,
    selectedDate,
    calendarDays: generateCalendarDays(),
    formatYearMonth,
    formatDate,
    isToday,
    isSelected,
    hasKits,
    getKitsForDate,
    goToPrevMonth,
    goToNextMonth,
    handleDateClick,
  };
};
