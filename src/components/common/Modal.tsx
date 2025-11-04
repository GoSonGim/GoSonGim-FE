import { useEffect, type ReactNode } from 'react';
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

export function ModalButton({ onClick, variant = 'primary', children, className }: ModalButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-[152px] cursor-pointer items-center justify-center rounded-[8px] px-[45px] py-[12px]',
        variant === 'primary' && 'bg-blue-1',
        variant === 'secondary' && 'bg-gray-20',
        className,
      )}
    >
      <p
        className={clsx(
          'text-center text-[18px] leading-normal font-normal whitespace-pre',
          variant === 'primary' && 'text-white',
          variant === 'secondary' && 'text-gray-80',
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
      className="bg-background-modal fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="flex flex-col items-center justify-center gap-[32px] rounded-[16px] bg-white px-[16px] py-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Custom children or default title/description layout */}
        {children ? (
          children
        ) : (
          <>
            {/* Title and Description */}
            {(title || description) && (
              <div className="flex flex-col items-center gap-[8px] text-center">
                {title && (
                  <p className="text-[22px] leading-normal font-semibold whitespace-pre text-gray-100">{title}</p>
                )}
                {description && (
                  <div className="text-gray-60 text-[18px] leading-normal font-normal">
                    {typeof description === 'string' ? <p>{description}</p> : description}
                  </div>
                )}
              </div>
            )}

            {/* Footer (Buttons) */}
            {footer && <div className="flex items-center gap-[8px]">{footer}</div>}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
