import { useNavigate } from 'react-router-dom';
import type { TalkingKit } from '@/types/talkingkit';
import BookmarkIcon from '@/assets/svgs/talkingkit/common/bookmarkempty.svg';

interface KitCardProps {
  kit: TalkingKit;
}

const KitCard = ({ kit }: KitCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/talkingkit/${kit.id}`);
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
          <p className="text-detail-02 text-gray-50">{kit.category}</p>
          <div className="text-heading-02-semibold-tight text-gray-100">
            <p className="mb-0">
              <span className="text-blue-1">{kit.highlightedText}</span>
              <span> {kit.mainText}</span>
            </p>
            <p>{kit.kitLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitCard;
