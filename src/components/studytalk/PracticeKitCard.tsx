import { useState } from 'react';
import clsx from 'clsx';
import { useRemoveBookmarkMutation } from '@/hooks/bookmark/mutations/useRemoveBookmarkMutation';
import BookmarkIcon from '@/assets/svgs/home/bookmarkchecked.svg';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

interface PracticeKitCardProps {
  bookmarkId: number;
  category: string;
  title: string;
}

export default function PracticeKitCard({ bookmarkId, category, title }: PracticeKitCardProps) {
  const [showModal, setShowModal] = useState(false);
  const removeBookmarkMutation = useRemoveBookmarkMutation();

  const handleConfirmDelete = () => {
    removeBookmarkMutation.mutate(bookmarkId);
    setShowModal(false);
  };

  return (
    <>
      <div
        className={clsx(
          'bg-gray-5 flex h-[138px] w-[173px] flex-col items-end gap-[4px] rounded-[16px] border border-[#f1f1f5] p-[8px] pr-0 transition-colors',
          'cursor-pointer hover:bg-[#eef0f2]',
        )}
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex size-[48px] shrink-0 cursor-pointer items-center justify-center"
          aria-label="북마크 제거"
        >
          <BookmarkIcon className="h-[21.814px] w-[16px] cursor-pointer" />
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
