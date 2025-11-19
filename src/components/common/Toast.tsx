import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * 토스트 메시지 컴포넌트
 * 화면 하단 중앙에 표시되며 3초 후 자동으로 사라짐
 */
export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="text-body-02-regular rounded-[8px] bg-gray-100 px-6 py-3 text-white shadow-lg">{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
