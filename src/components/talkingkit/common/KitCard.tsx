import { useNavigate } from 'react-router-dom';
import type { Kit } from '@/types/talkingkit';
import type { TalkingKit } from '@/types/talkingkit';
import { useAddKitBookmarkMutation } from '@/hooks/bookmark/mutations/useAddKitBookmarkMutation';
import { useRemoveBookmarkMutation } from '@/hooks/bookmark/mutations/useRemoveBookmarkMutation';
import BookmarkEmptyIcon from '@/assets/svgs/talkingkit/common/bookmarkempty.svg';
import BookmarkCheckedIcon from '@/assets/svgs/home/bookmarkchecked.svg';

interface KitCardProps {
  kit: TalkingKit | Kit;
  onClick?: () => void;
  isBookmarked?: boolean;
  bookmarkId?: number;
}

// kit이 Kit 타입인지 TalkingKit 타입인지 체크하는 타입 가드
const isApiKit = (kit: TalkingKit | Kit): kit is Kit => {
  return 'kitId' in kit && 'kitName' in kit;
};

const KitCard = ({ kit, onClick, isBookmarked = false, bookmarkId }: KitCardProps) => {
  const navigate = useNavigate();
  const addKitBookmarkMutation = useAddKitBookmarkMutation();
  const removeBookmarkMutation = useRemoveBookmarkMutation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const id = isApiKit(kit) ? kit.kitId : kit.id;
      navigate(`/talkingkit/${id}`);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const kitId = isApiKit(kit) ? kit.kitId : kit.id;

    if (isBookmarked && bookmarkId) {
      // 북마크 삭제
      removeBookmarkMutation.mutate(bookmarkId);
    } else {
      // 북마크 추가
      addKitBookmarkMutation.mutate({ kitList: [kitId] });
    }
  };

  // API Kit 타입인 경우 표시 데이터 생성
  const displayData = isApiKit(kit)
    ? {
        category: '조음 키트',
        highlightedText: kit.kitName.replace(/ 키트$/, ''), // "입술 소리"만 파란색
        mainText: '키트',
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
      <div className="flex h-[138px] w-[173px] flex-col items-end gap-[4px] overflow-hidden rounded-[inherit] py-2 pr-0 pl-2 shadow-lg">
        <button
          onClick={handleBookmarkClick}
          className="relative size-12 shrink-0 overflow-hidden cursor-pointer"
          aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
        >
          <div className="absolute inset-[24.81%_33.33%_29.75%_33.33%]">
            {isBookmarked ? (
              <BookmarkCheckedIcon className="h-full w-full" />
            ) : (
              <BookmarkEmptyIcon className="h-full w-full" />
            )}
          </div>
        </button>

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
