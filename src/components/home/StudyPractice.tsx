import { useNavigate } from 'react-router-dom';

import { useRandomSituations } from '@/hooks/home/useRandomSituations';
import { getSituationCategoryName, getSituationCategoryQuery } from '@/utils/studytalk/categoryUtils';
import ArrowRight from '@/assets/svgs/home/arrow-right.svg';

interface HomeStudyPracticeProps {
  className?: string;
}

export default function HomeStudyPractice({ className }: HomeStudyPracticeProps) {
  const navigate = useNavigate();
  const { randomSituations, isLoading, error } = useRandomSituations();

  const handleCardClick = (situationId: number, categoryEnum: string) => {
    const categoryQuery = getSituationCategoryQuery(categoryEnum);
    navigate(`/search/situation/${categoryQuery}/${situationId}`);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-6 ${className || ''}`}>
        <p className="text-[22px] leading-normal font-semibold text-gray-100">
          이런 <span className="text-blue-1">상황 연습</span>은 어떠신가요?
        </p>
        <div className="text-body-14-regular text-gray-60">로딩 중...</div>
      </div>
    );
  }

  if (error || randomSituations.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-6 ${className || ''}`}>
      <p className="text-[22px] leading-normal font-semibold text-gray-100">
        이런 <span className="text-blue-1">상황 연습</span>은 어떠신가요?
      </p>

      <div className="flex flex-col gap-2">
        {randomSituations.map((situation) => (
          <div
            key={situation.situationId}
            onClick={() => handleCardClick(situation.situationId, situation.categoryEnum)}
            className="flex cursor-pointer items-center justify-between rounded-2xl bg-white px-3 py-4 shadow-lg hover:bg-[#f1f1f5]"
          >
            <div className="flex items-center gap-1 leading-normal">
              <p className="text-heading-02-semibold whitespace-nowrap text-gray-100">{situation.situationName}</p>
              <p className="text-detail-02 whitespace-nowrap text-gray-50">
                •{getSituationCategoryName(situation.categoryEnum)}
              </p>
            </div>
            <button
              aria-label={`${situation.situationName} 시작하기`}
              className="flex shrink-0 items-center justify-center"
            >
              <ArrowRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
