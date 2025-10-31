import { useState } from 'react';
import clsx from 'clsx';
import BookmarkIcon from '@/assets/svgs/home/bookmarkchecked.svg';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

interface PracticeKitCardProps {
  id: number;
  category: string;
  title: string;
  onRemove: (id: number) => void;
}

export default function PracticeKitCard({ id, category, title, onRemove }: PracticeKitCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmDelete = () => {
    onRemove(id);
    setShowModal(false);
  };

  return (
    <>
      <div
        className={clsx(
          'flex h-[138px] w-[173px] flex-col items-end gap-[4px] rounded-[16px] border border-[#f1f1f5] bg-[#f7f7fa] p-[8px] pr-0 transition-colors',
          'hover:bg-[#eef0f2] cursor-pointer'
        )}
      >
        <button
          onClick={() => setShowModal(true)}
          className="size-[48px] flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="북마크 제거"
        >
          <BookmarkIcon className="w-[16px] h-[21.814px] cursor-pointer" />
        </button>

        <div className="flex w-full flex-col items-start px-[4px]">
          <p className="text-detail-02 text-[#8a94a0] leading-[1.5]">
            {category}
          </p>
          <p
            className="text-heading-02-semibold text-gray-100 whitespace-pre-line"
            style={{ lineHeight: '1.3' }}
          >
            {title}
          </p>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
