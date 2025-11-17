import { useNavigate, useParams } from 'react-router-dom';
import type { Situation } from '@/types/situation';
import BookmarkIcon from '@/assets/svgs/talkingkit/common/bookmarkempty.svg';

interface SituationCardProps {
  situation: Situation;
  onClick?: () => void;
}

const SituationCard = ({ situation, onClick }: SituationCardProps) => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 현재 카테고리 정보를 유지하면서 상세 페이지로 이동
      const currentCategory = category || 'daily';
      navigate(`/search/situation/${currentCategory}/${situation.situationId}`);
    }
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
          <div className="text-heading-02-semibold-tight text-gray-100">
            <p className="mb-0">
              <span className="text-gray-100">{situation.situationName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SituationCard;
