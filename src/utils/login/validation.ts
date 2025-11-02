/**
 * 이메일 형식 유효성 검사
 * @param email - 검사할 이메일 주소
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
