import { useState } from 'react';
import clsx from 'clsx';
import EyeOpen from '@/assets/svgs/login/loginForm/eyeOpen.svg';
import EyeClosed from '@/assets/svgs/login/loginForm/eyeClosed.svg';
import Warning from '@/assets/svgs/login/loginForm/warning.svg';
import WarningYellow from '@/assets/svgs/login/loginForm/warningYellow.svg';
import GreenCheck from '@/assets/svgs/login/signIn/greenCheck.svg';

interface InputProps {
  type: 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  errorType?: 'form' | 'user'; // form: 노란색, user: 빨간색
  placeholder: string;
  showCheckIcon?: boolean; // 회원가입 폼에서 검증 완료 시 체크 아이콘 표시
}

export const Input = ({
  type,
  label,
  value,
  onChange,
  onBlur,
  error,
  errorType = 'user',
  placeholder,
  showCheckIcon = false,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const hasValue = value.length > 0;
  const hasError = !!error;

  // Border 색상 결정
  const getBorderColor = () => {
    if (hasError) {
      if (isPassword || errorType === 'user') {
        return 'border-[#FF1953]'; // 빨간색
      }
      return 'border-[#E8C70B]'; // 노란색 (form error)
    }
    if (isFocused) {
      return isPassword ? 'border-[#5ACBB0]' : 'border-blue-2'; // 초록색 or 파란색
    }
    return 'border-gray-60'; // 기본 회색
  };

  // 에러 텍스트 색상
  const getErrorColor = () => {
    if (isPassword || errorType === 'user') {
      return 'text-[#FF1953]'; // 빨간색
    }
    return 'text-[#E8C70B]'; // 노란색
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {/* Label */}
      <label className="text-body-14-regular text-gray-60">{label}</label>

      {/* Input Container */}
      <div
        className={clsx(
          'flex items-center justify-between gap-2 rounded-lg border px-4 py-3 transition-colors',
          getBorderColor(),
        )}
      >
        {/* Input */}
        <input
          type={isPassword && !showPassword ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          className={clsx(
            'text-bold-02-semibold flex-1 bg-transparent outline-none',
            hasValue ? 'text-gray-80' : 'text-gray-30',
          )}
        />

        {/* Icons (비밀번호 눈 아이콘 + 에러 아이콘 + 체크 아이콘) */}
        <div className="flex items-center gap-2">
          {/* 비밀번호 보기/숨기기 아이콘 */}
          {isPassword && hasValue && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="shrink-0">
              {showPassword ? (
                <EyeOpen className="h-5 w-5 cursor-pointer" />
              ) : (
                <EyeClosed className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          )}

          {/* 에러 아이콘 */}
          {hasError && (
            <>
              {errorType === 'form' ? (
                <WarningYellow className="h-5 w-5 shrink-0" />
              ) : (
                <Warning className="h-5 w-5 shrink-0" />
              )}
            </>
          )}

          {/* 체크 아이콘 (회원가입 폼에서 검증 완료 시) */}
          {showCheckIcon && !hasError && <GreenCheck className="h-5 w-5 shrink-0" />}
        </div>
      </div>

      {/* 에러 메시지 */}
      {hasError && <p className={clsx('text-[12px] leading-normal', getErrorColor())}>{error}</p>}
    </div>
  );
};
