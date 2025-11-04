interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({ progress, size = 97, strokeWidth = 8 }: CircularProgressProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-90deg)',
      }}
    >
      {/* 배경 원 - 회색 */}
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#E2E4E7" strokeWidth={strokeWidth} />
      {/* 프로그레스 원 - 연한 파란색 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#9AADFF"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.1s linear',
        }}
      />
    </svg>
  );
}
