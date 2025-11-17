import { useState, useEffect } from 'react';

/**
 * 값의 변경을 지연시켜 debounce 처리하는 훅
 * @param value - debounce 처리할 값
 * @param delay - 지연 시간 (ms)
 * @returns debounced된 값
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: 다음 effect 실행 전 또는 컴포넌트 unmount 시 타이머 클리어
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
