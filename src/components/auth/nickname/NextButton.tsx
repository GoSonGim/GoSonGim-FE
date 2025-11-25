import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface NextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export const NextButton = ({ children, className, disabled, ...props }: NextButtonProps) => {
  return (
    <button
      className={clsx(
        'text-body-01-semibold flex w-full cursor-pointer items-center justify-center rounded-full px-4 py-3 transition-colors',
        disabled ? 'bg-gray-20 text-gray-60 cursor-not-allowed' : 'bg-[#EAEEFF] text-[#3540A8]',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
