import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onChangeNickname: (newNickname: string) => void;
}

export default function NicknameChangeModal({
  isOpen,
  onClose,
  currentNickname,
  onChangeNickname,
}: NicknameChangeModalProps) {
  const [newNickname, setNewNickname] = useState('');

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

  useEffect(() => {
    if (!isOpen) {
      setNewNickname('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  const handleChange = () => {
    if (newNickname.trim()) {
      onChangeNickname(newNickname.trim());
      setNewNickname('');
    }
  };

  const isButtonDisabled = !newNickname.trim();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]"
      onClick={handleBackdropClick}
    >
      <div
        className="flex w-[338px] flex-col gap-[24px] rounded-[16px] bg-white px-[16px] py-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <div className="flex w-full flex-col gap-[8px]">
          <p className="text-heading-01 text-center text-black">닉네임 변경</p>

          {/* 입력 필드들 */}
          <div className="flex flex-col gap-[8px]">
            {/* 기존 닉네임 */}
            <div className="flex flex-col">
              <p className="text-body-02-regular text-gray-60">기존 닉네임</p>
              <div className="border-gray-20 flex h-[48px] items-center rounded-[8px] border bg-[#f1f1f5] px-2">
                <p className="text-body-02-semibold text-gray-60">{currentNickname}</p>
              </div>
            </div>

            {/* 변경할 닉네임 */}
            <div className="flex flex-col">
              <p className="text-body-02-regular text-gray-60">변경할 닉네임</p>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isButtonDisabled) {
                    handleChange();
                  }
                }}
                placeholder=""
                className="text-body-02-regular border-blue-1 h-[48px] rounded-[8px] border bg-[#f1f1f5] px-2 text-black outline-none"
              />
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex h-[51px] gap-[8px]">
          <button
            onClick={onClose}
            className="text-body-01-regular bg-gray-20 text-gray-80 flex-1 cursor-pointer rounded-[8px] px-[45px] py-[12px] text-center whitespace-nowrap"
          >
            뒤로가기
          </button>
          <button
            onClick={handleChange}
            disabled={isButtonDisabled}
            className={`text-body-01-regular flex-1 rounded-[8px] px-[45px] py-[12px] text-center whitespace-nowrap text-white ${
              isButtonDisabled ? 'bg-gray-40' : 'bg-blue-1 cursor-pointer'
            }`}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
