import { useEffect } from 'react';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import KitCard from '@/components/talkingkit/common/KitCard';
import { kitsData } from '@/mock/talkingkit/kitsData';
import { useKitsByCategory } from '@/hooks/talkingkit/queries/useKitsByCategory';
import { useKitDetail } from '@/hooks/talkingkit/queries/useKitDetail';
import { useBookmarkStatus } from '@/hooks/bookmark/useBookmarkStatus';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/common/loggerUtils';

const TalkingKit = () => {
  const navigate = useNavigate();
  const { data: kitsData_API, error } = useKitsByCategory(1);
  const { data: kitDetail, error: detailError } = useKitDetail(1);
  const { getBookmarkStatus } = useBookmarkStatus('KIT');

  // API 응답 데이터 콘솔 출력 (카테고리별 키트 목록)
  useEffect(() => {
    if (kitsData_API) {
      logger.log('호흡 및 발성 기초 키트 API 응답:', kitsData_API);
      logger.log('키트 목록:', kitsData_API.result.kits);
    }
  }, [kitsData_API]);

  useEffect(() => {
    if (error) {
      logger.error('호흡 및 발성 기초 키트 조회 실패:', error);
    }
  }, [error]);

  // 키트 상세 정보 API 응답 콘솔 출력
  useEffect(() => {
    if (kitDetail) {
      logger.log('키트 상세 정보 API 응답:', kitDetail);
      logger.log('키트 ID:', kitDetail.result.kitId);
      logger.log('키트 이름:', kitDetail.result.kitName);
      logger.log('키트 카테고리:', kitDetail.result.kitCategory);
      logger.log('총 단계 수:', kitDetail.result.totalStages);
      logger.log('단계 목록:', kitDetail.result.stages);
    }
  }, [kitDetail]);

  useEffect(() => {
    if (detailError) {
      logger.error('키트 상세 정보 조회 실패:', detailError);
    }
  }, [detailError]);
  return (
    <div className="bg-background-primary relative h-full">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 (UI만) */}
          <div className="absolute left-4 flex size-12 items-center justify-center overflow-hidden p-2">
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon onClick={() => navigate('/search')} className="h-full w-full cursor-pointer" />
            </div>
          </div>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">호흡 및 발성 기초 키트</p>
        </div>
      </div>

      {/* 키트 그리드 */}
      <div className="mt-10 px-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {kitsData.slice(0, 2).map((kit) => {
              const { isBookmarked, bookmarkId } = getBookmarkStatus(kit.id);
              return <KitCard key={kit.id} kit={kit} isBookmarked={isBookmarked} bookmarkId={bookmarkId} />;
            })}
          </div>
          <div className="flex gap-4">
            {kitsData.slice(2, 3).map((kit) => {
              const { isBookmarked, bookmarkId } = getBookmarkStatus(kit.id);
              return <KitCard key={kit.id} kit={kit} isBookmarked={isBookmarked} bookmarkId={bookmarkId} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkingKit;
