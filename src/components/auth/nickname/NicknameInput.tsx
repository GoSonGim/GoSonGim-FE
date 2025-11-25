import { useState } from 'react';
import clsx from 'clsx';

interface NicknameInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
}

export const NicknameInput = ({ label, value, onChange, placeholder, maxLength = 4 }: NicknameInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value.length > 0;

  // Border 색상 결정
  const getBorderColor = () => {
    if (isFocused || hasValue) {
      return 'border-blue-2'; // 파란색
    }
    return 'border-gray-60'; // 기본 회색
  };

  // Input 변경 핸들러 (4글자 제한)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {/* Label */}
      <label className="text-body-02-regular text-gray-60 text-[14px]">{label}</label>

      {/* Input Container */}
      <div
        className={clsx(
          'flex items-center justify-between gap-2 rounded-lg border px-4 py-3 transition-colors',
          getBorderColor(),
        )}
      >
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={clsx(
            'text-body-02-semibold flex-1 bg-transparent outline-none',
            hasValue ? 'text-gray-80' : 'text-gray-30',
          )}
        />
      </div>
    </div>
  );
};
