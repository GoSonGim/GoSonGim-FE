import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AccountConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'logout' | 'withdraw';
  onConfirm: () => void;
}

export default function AccountConfirmModal({ isOpen, onClose, type, onConfirm }: AccountConfirmModalProps) {
  const [cancelHover, setCancelHover] = useState(false);
  const [confirmHover, setConfirmHover] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  // 타입별 컨텐츠
  const content = {
    logout: {
      title: '로그아웃을 진행하시겠습니까?',
      description: (
        <>
          다시 로그인하려면 소셜로그인
          <br />
          혹은 아이디/비밀번호가 필요합니다.
        </>
      ),
      confirmText: '로그아웃',
      confirmBg: '#4C5EFF',
      confirmHoverBg: '#3540A8',
    },
    withdraw: {
      title: '계정을 탈퇴하시겠습니까?',
      description: (
        <>
          계정을 탈퇴하시면 모든 학습기록과
          <br />
          사용자의 정보가 삭제됩니다.
        </>
      ),
      confirmText: '탈퇴하기',
      confirmBg: '#FF4C4F',
      confirmHoverBg: '#B44143',
    },
  };

  const currentContent = content[type];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(25, 25, 25, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="flex w-[345px] flex-col items-center justify-center gap-[32px] rounded-[16px] bg-white px-[16px] py-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 타이틀 및 설명 */}
        <div className="flex w-[264px] flex-col items-center gap-[8px] text-center">
          <p className="whitespace-pre text-[22px] font-semibold leading-normal text-gray-100">
            {currentContent.title}
          </p>
          <div className="text-[18px] font-normal leading-normal text-[#6C7582]">{currentContent.description}</div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex w-full items-center gap-[8px]">
          {/* 뒤로가기 버튼 */}
          <button
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            onClick={onClose}
            className="flex w-[152px] cursor-pointer items-center justify-center overflow-hidden rounded-[8px] px-[45px] py-[12px] transition-colors"
            style={{ backgroundColor: cancelHover ? '#C6CCD1' : '#E2E4E7' }}
          >
            <p className="whitespace-pre text-center text-[18px] font-normal leading-normal text-[#3C434F]">
              뒤로가기
            </p>
          </button>

          {/* 확인 버튼 (로그아웃/탈퇴하기) */}
          <button
            onMouseEnter={() => setConfirmHover(true)}
            onMouseLeave={() => setConfirmHover(false)}
            onClick={onConfirm}
            className="flex w-[152px] cursor-pointer items-center justify-center overflow-hidden rounded-[8px] px-[45px] py-[12px] transition-colors"
            style={{
              backgroundColor: confirmHover ? currentContent.confirmHoverBg : currentContent.confirmBg,
            }}
          >
            <p className="whitespace-pre text-center text-[18px] font-normal leading-normal text-white">
              {currentContent.confirmText}
            </p>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

