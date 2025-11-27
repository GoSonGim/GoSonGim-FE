import { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import TimerProgressBar from '@/components/talkingkit/progressBar/TimerProgressBar';
import {
  articulationTypeConfig,
  type ArticulationType,
} from '@/constants/talkingkit/soundPosition/articulationPractice';

const ArticulationStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: ArticulationType }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const REPEAT_COUNT = 4; // 4회 반복

  // type이 유효하지 않으면 기본값 사용
  const validType = type && articulationTypeConfig[type] ? type : 'lip-sound';
  const config = articulationTypeConfig[validType];

  // URL 패턴에서 기본 경로 추출
  const basePath = location.pathname.includes('sound-position') ? 'sound-position' : 'sound-way';

  // 시작하기 버튼 클릭
  const handleButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // 영상 종료 시 반복 재생
  const handleVideoEnded = () => {
    const newCount = playCount + 1;
    setPlayCount(newCount);

    if (newCount < REPEAT_COUNT && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // 타이머 완료 시 자동 라우팅
  const handleTimerComplete = () => {
    navigate(`/talkingkit/${basePath}/${validType}/step2`);
  };

  const handleBackClick = () => {
    if (basePath === 'sound-position') {
      navigate('/search/articulation-position');
    } else {
      navigate('/search/articulation-method');
    }
  };

  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          <div
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            onClick={handleBackClick}
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>
          <p className="text-heading-02-regular text-gray-100">{config.name}</p>
        </div>
      </div>

      {/* 상단 진행바 (1단계 활성) */}
      <AnimatedContainer variant="fadeInUpSmall" delay={0} className="px-4 py-3" disabled={false}>
        <div className="flex gap-2">
          <div className="bg-blue-1 h-1 flex-1 rounded-full" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
        </div>
      </AnimatedContainer>

      {/* 본문 */}
      <div className="relative flex flex-1 flex-col items-center px-4 py-4 pb-12">
        <div className="flex w-full flex-col gap-10">
          {/* 단계 정보 */}
          <div className="flex w-full flex-col gap-2">
            <AnimatedContainer variant="fadeInUp" delay={0.1} className="mb-2 w-full text-left" disabled={false}>
              <p className="text-detail-01 text-gray-60">1단계</p>
              <h2 className="text-heading-02-semibold text-gray-100">근육 강화하기</h2>
            </AnimatedContainer>

            {/* ✅ 흰색 박스 (애니메이션 제거) */}
            <div className="border-gray-20 w-full overflow-hidden rounded-[16px] border bg-white">
              <div className="relative h-[352px] w-full overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  muted
                  preload="auto"
                  disablePictureInPicture
                  controlsList="nodownload noremoteplayback noplaybackrate"
                  onEnded={handleVideoEnded}
                >
                  <source src={`/videos/${config.videoFile}`} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* 안내 텍스트와 버튼 */}
          {!isPlaying && (
            <AnimatedContainer
              variant="fadeIn"
              delay={0.25}
              className="flex w-full flex-col items-center gap-4"
              disabled={false}
            >
              <p className="text-body-02-regular text-gray-60 text-center">영상에 따라 글자를 따라 읽으세요</p>
              <button
                onClick={handleButtonClick}
                className="text-heading-02-semibold bg-blue-1 h-12 w-72 cursor-pointer rounded-full text-white transition-colors hover:bg-blue-600"
              >
                시작하기
              </button>
            </AnimatedContainer>
          )}
        </div>
      </div>

      {/* 하단 진행바 (재생 중일 때만 표시) */}
      {isPlaying && (
        <div className="absolute right-0 bottom-0 left-0 z-50 px-[29px] pb-[40px]">
          <TimerProgressBar duration={8000} onComplete={handleTimerComplete} />
        </div>
      )}
    </div>
  );
};

export default ArticulationStep1;
