import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KitListLayout from '@/components/talkingkit/layout/KitListLayout';
import KitCard from '@/components/talkingkit/common/KitCard';
import { articulationMethodKitsMockData } from '@/mock/search/articulationMethodKits.mock';
import { useKitsByCategory } from '@/hooks/queries/useKitsByCategory';

const ArticulationMethodKit = () => {
  const navigate = useNavigate();
  const { data: kitsData, error } = useKitsByCategory(3);

  // API 응답 데이터 콘솔 출력
  useEffect(() => {
    if (kitsData) {
      console.log('조음 방식별 연습 키트 API 응답:', kitsData);
      console.log('키트 목록:', kitsData.result.kits);
    }
  }, [kitsData]);

  useEffect(() => {
    if (error) {
      console.error('조음 방식별 연습 키트 조회 실패:', error);
    }
  }, [error]);

  const handleBack = () => {
    navigate('/search');
  };

  return (
    <KitListLayout title="조음 방식별 연습 키트" gridCount={articulationMethodKitsMockData.length} onBack={handleBack}>
      <div className="flex gap-4">
        {articulationMethodKitsMockData.slice(0, 2).map((kit) => (
          <KitCard
            key={kit.id}
            kit={kit}
            onClick={() => console.log(`조음 방식별 키트 클릭: ${kit.id} - ${kit.highlightedText}`)}
          />
        ))}
      </div>
      <div className="flex gap-4">
        {articulationMethodKitsMockData.slice(2, 4).map((kit) => (
          <KitCard
            key={kit.id}
            kit={kit}
            onClick={() => console.log(`조음 방식별 키트 클릭: ${kit.id} - ${kit.highlightedText}`)}
          />
        ))}
      </div>
    </KitListLayout>
  );
};

export default ArticulationMethodKit;
