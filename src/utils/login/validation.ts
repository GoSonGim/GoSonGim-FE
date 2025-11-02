/**
 * 이메일 형식 유효성 검사
 * @param email - 검사할 이메일 주소
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 */
export const isValidEmail = (email: string): boolean => {
  // TLD(최상위 도메인)가 최소 2글자 이상이어야 함 (.com, .kr 등)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
