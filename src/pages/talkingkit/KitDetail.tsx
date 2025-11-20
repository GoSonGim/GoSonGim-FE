import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SOUND_POSITION_MAP, SOUND_WAY_MAP } from '@/utils/talkingkit/routingUtils';

const KitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const kitId = Number(id);

    // 길게 소리내기 키트(id=1)
    if (kitId === 1) {
      navigate(`/talkingkit/${kitId}/breathing`, { replace: true });
    }
    // 일정한 소리내기 키트(id=2)
    else if (kitId === 2) {
      navigate(`/talkingkit/${kitId}/steady-sound`, { replace: true });
    }
    // 큰 소리 내기 키트(id=3)
    else if (kitId === 3) {
      navigate(`/talkingkit/${kitId}/loud-sound`, { replace: true });
    }
    // 조음 위치별 키트 (kitId: 4-7)
    else if (SOUND_POSITION_MAP[kitId]) {
      navigate(`/talkingkit/sound-position/${SOUND_POSITION_MAP[kitId]}/step1`, { replace: true });
    }
    // 조음 방식별 키트 (kitId: 8-11)
    else if (SOUND_WAY_MAP[kitId]) {
      navigate(`/talkingkit/sound-way/${SOUND_WAY_MAP[kitId]}/step1`, { replace: true });
    }
    // 다른 키트는 준비 중 - talkingkit 페이지로 돌아가기
    else {
      alert('준비 중입니다.');
      navigate('/talkingkit', { replace: true });
    }
  }, [id, navigate]);

  return null;
};

export default KitDetail;
