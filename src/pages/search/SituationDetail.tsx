import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import { useSituationDetail } from '@/hooks/queries/useSituationDetail';

const SituationDetail = () => {
  const navigate = useNavigate();
  const { situationId } = useParams<{ situationId: string; category: string }>();
  const [imageError, setImageError] = useState(false);

  const situationIdNum = situationId ? parseInt(situationId, 10) : 0;
  const { data: situationDetailData, isLoading, error } = useSituationDetail(situationIdNum);

  // API 응답에서 데이터 가져오기
  const situationDetail = situationDetailData?.result;

  // 디버깅: API 응답 확인
  useEffect(() => {
    if (situationDetail) {
      console.log('상황극 상세 데이터:', situationDetail);
      console.log('이미지 URL:', situationDetail.image);
      console.log('이미지 URL 타입:', typeof situationDetail.image);
      console.log('이미지 URL 길이:', situationDetail.image?.length);
    }
  }, [situationDetail]);

  // 이미지가 변경될 때 에러 상태 리셋
  useEffect(() => {
    setImageError(false);
  }, [situationDetail?.image]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleStartClick = () => {
    // 시작하기 버튼 클릭 시 동작 (추후 구현)
    console.log('시작하기 클릭');
  };

  return (
    <div className="bg-background-primary relative h-full">
      {/* 상단 헤더 */}
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
          <p className="text-heading-02-regular text-gray-100">{situationDetail?.situationName || '상황극 상세'}</p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col gap-6 px-[19px] pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-body-01-regular text-gray-60">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-body-01-regular text-red-500">상황극 정보를 불러오는데 실패했습니다.</p>
          </div>
        ) : !situationDetail ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-body-01-regular text-gray-60">상황극 정보가 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 설명 텍스트 박스 */}
            <div className="flex h-[104px] w-full items-center justify-center rounded-[9px] bg-white px-4 py-4">
              <p className="text-body-01-medium text-center leading-normal whitespace-pre-line text-gray-100">
                {situationDetail.description}
              </p>
            </div>

            {/* 이미지 영역 */}
            <div className="relative h-[264px] w-full overflow-hidden rounded-[9px] bg-[#d9d9d9]">
              {situationDetail.image && situationDetail.image.trim() !== '' && !imageError ? (
                <img
                  src={situationDetail.image}
                  alt={situationDetail.situationName}
                  className="h-full w-full rounded-[9px] object-cover"
                  onError={(e) => {
                    console.error('이미지 로드 실패:', situationDetail.image);
                    console.error('이미지 에러 이벤트:', e);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('이미지 로드 성공:', situationDetail.image);
                    setImageError(false);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex h-full items-center justify-center">
                  <p className="text-body-01-regular text-gray-60">
                    {!situationDetail.image || situationDetail.image.trim() === '' ? '이미지 없음' : '이미지 로드 실패'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 시작하기 버튼 */}
      <div className="absolute bottom-[149px] left-0 flex w-full justify-center px-[53px]">
        <button
          onClick={handleStartClick}
          className="bg-blue-1 hover:bg-blue-1-hover h-12 w-full rounded-[100px] transition-colors"
          disabled={isLoading || !situationDetail}
        >
          <p className="text-heading-02-semibold text-white">시작하기</p>
        </button>
      </div>
    </div>
  );
};

export default SituationDetail;
