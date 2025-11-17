import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'google' | 'signup';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  icon,
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'flex items-center justify-between w-full rounded-full p-4 text-body-01-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-2 text-white hover:bg-blue-2-hover',
    secondary: 'bg-white text-gray-80 border border-gray-40 hover:bg-gray-5',
    google: 'bg-white text-[#1F1F1F] border border-[#747775] hover:bg-gray-5',
    signup: 'bg-white text-gray-80 border border-blue-1 hover:bg-gray-5 hover:border-gray-40',
  };

  return (
    <button className={clsx(baseStyles, variantStyles[variant], className)} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && <span className="w-5 shrink-0" />}
        </>
      )}
    </button>
  );
};
