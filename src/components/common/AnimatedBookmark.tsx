import { motion } from 'framer-motion';
import BookmarkCheckedIcon from '@/assets/svgs/home/bookmarkchecked.svg';
import BookmarkEmptyIcon from '@/assets/svgs/talkingkit/common/bookmarkempty.svg';

interface AnimatedBookmarkProps {
  isBookmarked: boolean;
  className?: string;
}

export const AnimatedBookmark = ({ isBookmarked, className = 'h-full w-full' }: AnimatedBookmarkProps) => {
  return (
    <motion.div
      whileTap={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={className}
    >
      {isBookmarked ? (
        <BookmarkCheckedIcon className="h-full w-full" />
      ) : (
        <BookmarkEmptyIcon className="h-full w-full" />
      )}
    </motion.div>
  );
};

