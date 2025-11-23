// ReviewCalendar에서 사용하는 요일 상수
export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export type WeekdayType = (typeof WEEKDAYS)[number];
