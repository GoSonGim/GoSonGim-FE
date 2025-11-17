import { useNavigate, useParams } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import SituationCard from '@/components/talkingkit/common/SituationCard';
import { useSituations } from '@/hooks/search/queries/useSituations';
import { getSituationCategoryTitle, getSituationCategoryId } from '@/utils/common/situationUtils';
import type { Situation } from '@/types/search';

const SituationCategory = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  // 카테고리 파라미터가 없으면 기본값 사용
  const categoryQuery = category || 'daily';
  const { data: situationsData, isLoading, error } = useSituations(categoryQuery);

  // 카테고리 ID로 제목 가져오기 (category는 API 쿼리 파라미터이므로 변환 필요)
  const categoryId = getSituationCategoryId(categoryQuery);
  const categoryTitle = getSituationCategoryTitle(categoryId);

  const handleBackClick = () => {
    navigate(-1);
  };

  // 상황극 목록을 2열 그리드로 표시하기 위한 배열 생성
  const situations = situationsData?.result.situations || [];
  const gridRows: Situation[][] = [];
  for (let i = 0; i < situations.length; i += 2) {
    gridRows.push(situations.slice(i, i + 2));
  }

  return (
    <div className="bg-background-primary relative h-full">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBackClick}
            className="absolute left-4 flex size-12 items-center justify-center overflow-hidden p-2"
            aria-label="뒤로가기"
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </button>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">{categoryTitle}</p>
        </div>
      </div>

      {/* 상황극 그리드 */}
      <div className="mt-10 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-body-01-regular text-gray-60">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-body-01-regular text-red-500">상황극 목록을 불러오는데 실패했습니다.</p>
          </div>
        ) : situations.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-body-01-regular text-gray-60">상황극이 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {gridRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                {row.map((situation) => (
                  <SituationCard key={situation.situationId} situation={situation} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SituationCategory;
