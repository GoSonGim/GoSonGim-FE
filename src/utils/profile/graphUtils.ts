export interface DayData {
  day: string;
  count: number; // 실제 표시용 높이 (0 | 3.5 | 4 | 4.5)
  actualCount: number; // 실제 데이터 (디버깅용)
}

export const transformGraphData = (recentDayCounts: number[]): DayData[] => {
  const dayLabels = ['1일', '2일', '3일', '4일', '5일'];

  return recentDayCounts.map((actualCount, index) => {
    let displayCount = 0;

    if (actualCount === 0) {
      displayCount = 0; // 막대 표시 안함
    } else if (index === 0) {
      // 첫날은 기준이 없으므로 중간 크기
      displayCount = 4;
    } else {
      const prevCount = recentDayCounts[index - 1];
      if (actualCount > prevCount) {
        displayCount = 4.5; // 증가 (간격 0.5)
      } else if (actualCount < prevCount) {
        displayCount = 3.5; // 감소 (간격 0.5)
      } else {
        displayCount = 4; // 변화 없음
      }
    }

    return {
      day: dayLabels[index],
      count: displayCount,
      actualCount,
    };
  });
};
