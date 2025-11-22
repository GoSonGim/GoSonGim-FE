/**
 * 조음 키트 이름을 라우트 경로로 매핑
 */
export const getKitRoute = (kitName: string): string => {
  const kitNameLower = kitName.toLowerCase();
  const kitNameNoSpace = kitName.replace(/\s/g, '');

  // 조음 위치 키트
  if (kitNameLower.includes('입술') || kitNameNoSpace.includes('입술소리')) {
    return '/talkingkit/sound-position/lip-sound/step1';
  }

  if (kitNameLower.includes('혀끝') || kitNameNoSpace.includes('혀끝소리')) {
    return '/talkingkit/sound-position/tongue-tip/step1';
  }

  if (kitNameLower.includes('목구멍') || kitNameNoSpace.includes('목구멍소리')) {
    return '/talkingkit/sound-position/throat/step1';
  }

  if (kitNameLower.includes('잇몸') || kitNameNoSpace.includes('잇몸소리')) {
    return '/talkingkit/sound-position/gum/step1';
  }

  // 조음 방법 키트
  if (kitNameLower.includes('파열음')) {
    return '/talkingkit/sound-way/plosive/step1';
  }

  if (kitNameLower.includes('마찰음')) {
    return '/talkingkit/sound-way/fricative/step1';
  }

  if (kitNameLower.includes('유음') || kitNameLower.includes('비음')) {
    return '/talkingkit/sound-way/liquid-nasal/step1';
  }

  if (kitNameLower.includes('턱') || kitNameLower.includes('턱 움직임')) {
    return '/talkingkit/sound-way/jaw-movement/step1';
  }

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

