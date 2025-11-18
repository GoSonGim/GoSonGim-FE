import type { ChangeEvent } from 'react';

interface SentenceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

/**
 * 문장 작성 입력 컴포넌트
 */
export const SentenceInput = ({
  value,
  onChange,
  placeholder = '연습할 문장을 입력하세요',
  maxLength = 100,
  disabled = false,
}: SentenceInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="text-body-01-regular border-gray-20 placeholder:text-gray-60 focus:border-blue-1 disabled:bg-gray-10 disabled:text-gray-60 min-h-[120px] w-full resize-none rounded-[12px] border border-solid px-4 py-3 text-gray-100 focus:outline-none"
      />
      <div className="flex justify-end">
        <span className="text-caption-01-regular text-gray-60">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
};
