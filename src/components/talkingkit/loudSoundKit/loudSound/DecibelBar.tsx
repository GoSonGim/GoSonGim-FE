interface DecibelBarProps {
  currentDecibel: number; // 0-100
}

const DecibelBar = ({ currentDecibel }: DecibelBarProps) => {
  // 데시벨 값을 0-100 범위로 제한
  const clampedDecibel = Math.max(0, Math.min(100, currentDecibel));

  // 50dB까지는 회색, 그 이상은 연한 회색
  const grayWidth = Math.min(clampedDecibel, 50);
  const lightGrayWidth = Math.max(0, clampedDecibel - 50);

  return (
    <div className="flex w-full flex-col gap-[6px]">
      {/* dB 레이블 */}
      <p className="text-body-02-regular text-black">dB</p>

      {/* 막대 그래프 영역 */}
      <div className="relative h-[42px] w-full">
        {/* 배경 (빈 영역) */}
        <div className="absolute inset-0 bg-gray-200" />

        {/* 데시벨 막대 */}
        <div className="absolute inset-0 flex">
          {/* 0-50dB: 회색 (#888888) */}
          {grayWidth > 0 && (
            <div
              className="h-full bg-[#888888] transition-all duration-100"
              style={{ width: `${(grayWidth / 100) * 100}%` }}
            />
          )}

          {/* 50-100dB: 연한 회색 (#d9d9d9) */}
          {lightGrayWidth > 0 && (
            <div
              className="h-full bg-[#d9d9d9] transition-all duration-100"
              style={{ width: `${(lightGrayWidth / 100) * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* 기준선 */}
      <div className="relative flex w-full justify-between px-px">
        <span className="text-body-02-regular text-black">0</span>
        <span className="text-body-02-regular text-black">40</span>
        <span className="text-body-02-regular text-black">60</span>
        <span className="text-body-02-regular text-black">80</span>
        <span className="text-body-02-regular text-black">100</span>
      </div>
    </div>
  );
};

export default DecibelBar;
