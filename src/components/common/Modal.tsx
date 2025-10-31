import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string | ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  hideCloseOnBackdrop?: boolean;
}

interface ModalButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
}

export function ModalButton({
  onClick,
  variant = 'primary',
  children,
  className,
}: ModalButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center px-[45px] py-[12px] rounded-[8px] w-[152px] cursor-pointer',
        variant === 'primary' && 'bg-[#4c5eff]',
        variant === 'secondary' && 'bg-[#e2e4e7]',
        className
      )}
    >
      <p
        className={clsx(
          'text-[18px] font-normal leading-[1.5] text-center whitespace-pre',
          variant === 'primary' && 'text-white',
          variant === 'secondary' && 'text-[#3c434f]'
        )}
      >
        {children}
      </p>
    </button>
  );
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  hideCloseOnBackdrop = false,
}: ModalProps) {
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
    if (!hideCloseOnBackdrop) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-modal"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white flex flex-col gap-[32px] items-center justify-center px-[16px] py-[24px] rounded-[16px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Custom children or default title/description layout */}
        {children ? (
          children
        ) : (
          <>
            {/* Title and Description */}
            {(title || description) && (
              <div className="flex flex-col gap-[8px] items-center text-center">
                {title && (
                  <p className="text-[22px] font-semibold leading-[1.5] text-gray-100 whitespace-pre">
                    {title}
                  </p>
                )}
                {description && (
                  <div className="text-[18px] font-normal leading-[1.5] text-[#6c7582]">
                    {typeof description === 'string' ? <p>{description}</p> : description}
                  </div>
                )}
              </div>
            )}

            {/* Footer (Buttons) */}
            {footer && <div className="flex gap-[8px] items-center">{footer}</div>}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
