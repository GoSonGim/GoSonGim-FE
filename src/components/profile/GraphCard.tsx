import { ComposedChart, Bar, Line, XAxis, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  count: number;
}

interface GraphCardProps {
  title: string;
  data: MonthlyData[];
  totalCount: number;
  showArrow?: boolean;
  ArrowIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onArrowClick?: () => void;
}

export default function GraphCard({
  title,
  data,
  totalCount,
  showArrow = false,
  ArrowIcon,
  onArrowClick,
}: GraphCardProps) {
  return (
    <div className="embla__slide flex min-w-[343px] cursor-pointer flex-col gap-2 rounded-[16px] bg-white p-4">
      <div className="flex items-start justify-between">
        <p className="text-heading-01 text-black">{title}</p>
        {showArrow && ArrowIcon && (
          <button
            className="bg-blue-2 flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onArrowClick?.();
            }}
          >
            <ArrowIcon className="h-[48px] w-[48px]" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="border-gray-20 w-[200px] rounded-[16px] border px-4 py-2">
          <div className="relative flex flex-col items-center overflow-visible">
            <ResponsiveContainer width="100%" height={116}>
              <ComposedChart data={data} margin={{ top: 3 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#3c434f', fontSize: 16 }} />
                <Bar dataKey="count" fill="#9aadff" radius={[2, 2, 0, 0]} barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 z-10">
              <ResponsiveContainer width="100%" height={116}>
                <ComposedChart
                  data={data.map((item) => ({ ...item, lineValue: item.count + 2.5 }))}
                  margin={{ top: 3, right: 18 }}
                >
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'transparent' }} hide />
                  <Line
                    type="monotone"
                    dataKey="lineValue"
                    stroke="#000000"
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, index } = props;
                      if (index === data.length - 1) {
                        return <circle cx={cx} cy={cy} r={4} fill="#4c5eff" />;
                      }
                      return <></>;
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-detail-01 text-gray-80 leading-normal">총 발화 성공 횟수</p>
          <p className="text-blue-1 text-[24px] leading-[1.4] font-semibold">{totalCount.toLocaleString()}회</p>
        </div>
      </div>
    </div>
  );
}
