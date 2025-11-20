/**
 * 조음 키트 이름을 라우트 경로로 매핑
 */
export const getKitRoute = (kitName: string): string => {
  const kitNameLower = kitName.toLowerCase();

  // 호흡 관련 키트
  if (kitNameLower.includes('길게') || kitNameLower.includes('호흡')) {
    return '/talkingkit/1/breathing';
  }

  // 일정한 소리
  if (kitNameLower.includes('일정한')) {
    return '/talkingkit/2/steady-sound';
  }

  // 큰 소리
  if (kitNameLower.includes('큰 소리') || kitNameLower.includes('큰소리')) {
    return '/talkingkit/3/loud-sound';
  }

  // 짧게 소리내기
  if (kitNameLower.includes('짧게')) {
    return '/talkingkit/4/short-sound';
  }

  // 모음 음높이
  if (kitNameLower.includes('모음') || kitNameLower.includes('음높이')) {
    return '/talkingkit/5/vowel-pitch';
  }

  // 기본값 (호흡으로 fallback)
  return '/talkingkit/1/breathing';
};

