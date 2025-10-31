import Modal, { ModalButton } from '@/components/common/Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="내 학습에서 삭제하시겠습니까?"
      description={
        <>
          <p>내 학습에서 삭제되며 학습탐색에서</p>
          <p>다시 담을 수 있습니다.</p>
        </>
      }
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            뒤로가기
          </ModalButton>
          <ModalButton variant="primary" onClick={onConfirm}>
            삭제하기
          </ModalButton>
        </>
      }
    />
  );
}
