import { useState, useCallback } from 'react';

interface UseToastReturn {
  message: string;
  isVisible: boolean;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

/**
 * 토스트 메시지 표시 훅
 */
export const useToast = (): UseToastReturn => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    message,
    isVisible,
    showToast,
    hideToast,
  };
};
