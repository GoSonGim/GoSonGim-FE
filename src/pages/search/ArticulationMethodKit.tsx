import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KitListLayout from '@/components/talkingkit/layout/KitListLayout';
import KitCard from '@/components/talkingkit/common/KitCard';
import { useKitsByCategory } from '@/hooks/queries/useKitsByCategory';
import { logger } from '@/utils/loggerUtils';

const ArticulationMethodKit = () => {
  const navigate = useNavigate();
  const { data: kitsData, isLoading, error } = useKitsByCategory(3);

  // API 응답 데이터 로깅
  useEffect(() => {
    if (kitsData) {
      logger.log('조음 방식별 연습 키트 API 응답:', kitsData);
      logger.log('키트 목록:', kitsData.result.kits);
    }
  }, [kitsData]);

  useEffect(() => {
    if (error) {
      logger.error('조음 방식별 연습 키트 조회 실패:', error);
    }
  }, [error]);

  const handleBack = () => {
    navigate('/search');
  };

  const handleKitClick = (kitId: number, kitName: string) => {
    logger.log(`조음 방식별 키트 클릭: ${kitId} - ${kitName}`);
    // TODO: 키트 상세 페이지로 라우팅
  };

  const kits = kitsData?.result.kits || [];
  const gridCount = kits.length;

  return (
    <KitListLayout title="조음 방식별 연습 키트" gridCount={gridCount} onBack={handleBack}>
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-body-01-regular text-gray-60">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-body-01-regular text-red-500">키트 목록을 불러오는데 실패했습니다.</p>
        </div>
      ) : kits.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-body-01-regular text-gray-60">키트가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            {kits.slice(0, 2).map((kit) => (
              <KitCard key={kit.kitId} kit={kit} onClick={() => handleKitClick(kit.kitId, kit.kitName)} />
            ))}
          </div>
          {kits.length > 2 && (
            <div className="flex gap-4">
              {kits.slice(2, 4).map((kit) => (
                <KitCard key={kit.kitId} kit={kit} onClick={() => handleKitClick(kit.kitId, kit.kitName)} />
              ))}
            </div>
          )}
        </>
      )}
    </KitListLayout>
  );
};

export default ArticulationMethodKit;
