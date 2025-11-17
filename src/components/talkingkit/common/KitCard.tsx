import { useNavigate } from 'react-router-dom';
import type { Kit } from '@/types/talkingkit';
import type { TalkingKit } from '@/types/talkingkit';
import BookmarkIcon from '@/assets/svgs/talkingkit/common/bookmarkempty.svg';

interface KitCardProps {
  kit: TalkingKit | Kit;
  onClick?: () => void;
}

// kit이 Kit 타입인지 TalkingKit 타입인지 체크하는 타입 가드
const isApiKit = (kit: TalkingKit | Kit): kit is Kit => {
  return 'kitId' in kit && 'kitName' in kit;
};

const KitCard = ({ kit, onClick }: KitCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const id = isApiKit(kit) ? kit.kitId : kit.id;
      navigate(`/talkingkit/${id}`);
    }
  };

  // API Kit 타입인 경우 표시 데이터 생성
  const displayData = isApiKit(kit)
    ? {
        category: '조음 키트',
        highlightedText: kit.kitName,
        mainText: '',
        kitLabel: '학습하기',
      }
    : {
        category: kit.category,
        highlightedText: kit.highlightedText,
        mainText: kit.mainText,
        kitLabel: kit.kitLabel,
      };

  return (
    <div
      className="relative h-[138px] w-[173px] cursor-pointer rounded-[16px] border border-[#f1f1f5] bg-white transition-shadow hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex h-[138px] w-[173px] flex-col items-end gap-[4px] overflow-hidden rounded-[inherit] py-2 pr-0 pl-2">
        <div className="relative size-12 shrink-0 overflow-hidden">
          <div className="absolute inset-[24.81%_33.33%_29.75%_33.33%]">
            <BookmarkIcon className="h-full w-full" />
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start px-1 py-0">
          <p className="text-detail-02 text-gray-50">{displayData.category}</p>
          <div className="text-heading-02-semibold-tight text-gray-100">
            <p className="mb-0">
              <span className="text-blue-1">{displayData.highlightedText}</span>
              <span> {displayData.mainText}</span>
            </p>
            <p>{displayData.kitLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitCard;
