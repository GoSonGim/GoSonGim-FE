import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KitListLayout from '@/components/talkingkit/layout/KitListLayout';
import KitCard from '@/components/talkingkit/common/KitCard';
import { articulationPositionKitsMockData } from '@/mock/search/articulationPositionKits.mock';
import { useKitsByCategory } from '@/hooks/queries/useKitsByCategory';

const ArticulationPositionKit = () => {
  const navigate = useNavigate();
  const { data: kitsData, error } = useKitsByCategory(2);

  // API 응답 데이터 콘솔 출력
  useEffect(() => {
    if (kitsData) {
      console.log('조음 위치별 연습 키트 API 응답:', kitsData);
      console.log('키트 목록:', kitsData.result.kits);
    }
  }, [kitsData]);

  useEffect(() => {
    if (error) {
      console.error('조음 위치별 연습 키트 조회 실패:', error);
    }
  }, [error]);

  const handleBack = () => {
    navigate('/search');
  };

  const handleKitClick = (kitId: number, kitTitle: string) => {
    if (kitId === 101) {
      // 입술 소리 키트
      navigate('/search/articulation-position/lip-sound/step1');
    } else {
      console.log(`조음 위치별 키트 클릭: ${kitId} - ${kitTitle}`);
    }
  };

  return (
    <KitListLayout
      title="조음 위치별 연습 키트"
      gridCount={articulationPositionKitsMockData.length}
      onBack={handleBack}
    >
      <div className="flex gap-4">
        {articulationPositionKitsMockData.slice(0, 2).map((kit) => (
          <KitCard
            key={kit.id}
            kit={kit}
            onClick={() => handleKitClick(kit.id, `${kit.highlightedText} ${kit.mainText}`)}
          />
        ))}
      </div>
      <div className="flex gap-4">
        {articulationPositionKitsMockData.slice(2, 4).map((kit) => (
          <KitCard
            key={kit.id}
            kit={kit}
            onClick={() => handleKitClick(kit.id, `${kit.highlightedText} ${kit.mainText}`)}
          />
        ))}
      </div>
    </KitListLayout>
  );
};

export default ArticulationPositionKit;
