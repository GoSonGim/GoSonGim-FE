import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export const LoginButton = ({ children, className, disabled, ...props }: LoginButtonProps) => {
  return (
    <button
      className={clsx(
        'text-body-01-semibold flex w-full cursor-pointer items-center justify-center rounded-full px-[152px] py-3 transition-colors',
        disabled
          ? 'bg-gray-20 text-gray-60 cursor-not-allowed'
          : 'bg-blue-3 text-blue-1-hover hover:bg-blue-3-hover active:bg-blue-3-hover',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
