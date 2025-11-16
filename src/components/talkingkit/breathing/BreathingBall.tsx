import { motion } from 'framer-motion';
import type { BreathingPhase } from '@/types/talkingkit/breathing';

interface BreathingBallProps {
  position: { x: number; y: number };
  phase: BreathingPhase;
}

const BreathingBall = ({ position, phase }: BreathingBallProps) => {
  if (phase === 'complete') return null;

  const isReady = phase === 'ready';

  return (
    <motion.div
      className="absolute z-10 h-[26px] w-[26px] rounded-full bg-[#D1D5DB] shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        x: '-50%',
        y: '-50%',
      }}
      initial={isReady ? { scale: 0.8, opacity: 0 } : false}
      animate={isReady ? { scale: 1, opacity: 1 } : {}}
      transition={
        isReady
          ? { duration: 0.3 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }
      }
    />
  );
};

export default BreathingBall;
