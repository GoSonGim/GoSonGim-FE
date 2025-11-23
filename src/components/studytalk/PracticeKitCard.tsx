import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useRemoveBookmarkMutation } from '@/hooks/bookmark/mutations/useRemoveBookmarkMutation';
import { AnimatedBookmark } from '@/components/common/AnimatedBookmark';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

interface PracticeKitCardProps {
  bookmarkId: number;
  kitId: number;
  category: string;
  title: string;
  onClick?: () => void;
}

export default function PracticeKitCard({ bookmarkId, kitId, category, title, onClick }: PracticeKitCardProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const removeBookmarkMutation = useRemoveBookmarkMutation();

  const handleConfirmDelete = () => {
    removeBookmarkMutation.mutate(bookmarkId);
    setShowModal(false);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/talkingkit/${kitId}`);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={clsx(
          'bg-gray-5 flex h-[138px] w-[173px] flex-col items-end gap-[4px] rounded-[16px] border border-[#f1f1f5] p-[8px] pr-0 shadow-lg transition-colors',
          'cursor-pointer hover:bg-[#eef0f2]',
        )}
      >
        <button
          onClick={handleBookmarkClick}
          className="flex size-[48px] shrink-0 cursor-pointer items-center justify-center"
          aria-label="북마크 제거"
        >
          <AnimatedBookmark isBookmarked={true} className="h-[21.814px] w-[16px]" />
        </button>

        <div className="flex w-full flex-col items-start px-[4px]">
          <p className="text-detail-02 leading-normal text-gray-50">{category}</p>
          <p className="text-heading-02-semibold whitespace-pre-line text-gray-100" style={{ lineHeight: '1.3' }}>
            {title}
          </p>
        </div>
      </div>

      <DeleteConfirmModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmDelete} />
    </>
  );
}
