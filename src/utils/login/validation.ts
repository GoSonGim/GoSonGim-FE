/**
 * 이메일 형식 유효성 검사
 * @param email - 검사할 이메일 주소
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 */
export const isValidEmail = (email: string): boolean => {
  // 더 엄격한 이메일 검증:
  // - 로컬 파트(@앞): 알파벳, 숫자, 점, 언더스코어, 퍼센트, 플러스, 하이픈 허용
  // - 도메인 파트: 알파벳, 숫자, 점, 하이픈만 허용
  // - TLD: 최소 2글자 이상의 알파벳만 허용
  // - 연속된 점(..) 방지
  // - @나 .으로 시작/종료 방지
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 추가 검증: 연속된 점이나 잘못된 패턴 방지
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return false;
  }

  // @로 분리해서 도메인 부분 추가 검증
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;

  // 로컬 파트가 점으로 시작하거나 끝나면 안됨
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  // 도메인이 점으로 시작하거나 하이픈으로 시작/끝나면 안됨
  if (domain.startsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
    return false;
  }

  return emailRegex.test(email);
};
