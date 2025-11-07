import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  variant?: 'fadeInUp' | 'fadeInUpSmall' | 'fadeInScale' | 'fadeIn';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    duration: 0.5,
  },
  fadeInUpSmall: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    duration: 0.3,
  },
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    duration: 0.4,
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    duration: 0.4,
  },
};

const AnimatedContainer = ({ children, variant = 'fadeIn', delay = 0, className, disabled = false }: AnimatedContainerProps) => {
  const animation = animationVariants[variant];

  // 애니메이션 비활성화 시 일반 div 반환
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      transition={{ duration: animation.duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;

