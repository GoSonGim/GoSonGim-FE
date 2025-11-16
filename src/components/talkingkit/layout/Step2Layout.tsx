import { type ReactNode } from 'react';
import LeftArrowIcon from '@/assets/svgs/talkingkit/common/leftarrow.svg';
import AnimatedContainer from '@/components/talkingkit/common/AnimatedContainer';
import clsx from 'clsx';

interface Step2LayoutProps {
  headerTitle: string;
  title: string;
  children: ReactNode;
  showAction?: boolean;
  guideText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onBackClick?: () => void;
  disableAnimation?: boolean;
}

const Step2Layout = ({
  headerTitle,
  title,
  children,
  showAction = false,
  guideText,
  buttonText,
  onButtonClick,
  onBackClick,
  disableAnimation = false,
}: Step2LayoutProps) => {
  return (
    <div className="bg-background-primary relative flex h-full flex-col">
      {/* 상단 바 */}
      <div className="h-16 w-full overflow-hidden bg-white">
        <div className="relative flex h-full items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <div
            className="absolute left-4 flex size-12 cursor-pointer items-center justify-center overflow-hidden p-2"
            onClick={onBackClick}
          >
            <div className="h-[18px] w-[10px]">
              <LeftArrowIcon className="h-full w-full" />
            </div>
          </div>

          {/* 제목 */}
          <p className="text-heading-02-regular text-gray-100">{headerTitle}</p>
        </div>
      </div>

      {/* 상단 진행바 (2단계 활성) */}
      <AnimatedContainer variant="fadeInUpSmall" delay={0} className="px-4 py-3" disabled={disableAnimation}>
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
          <div className="bg-blue-1 h-1 flex-1 rounded-full" />
        </div>
      </AnimatedContainer>

      {/* 본문 */}
      <div className="bg-background-primary relative flex flex-col items-center px-4 pt-4 pb-0">
        {/* 단계 정보와 흰색 박스 */}
        <div className={clsx('flex w-full flex-col', showAction ? 'gap-[72px]' : 'gap-0')}>
          {/* 단계 정보 */}
          <div className="flex w-full flex-col gap-2">
            <AnimatedContainer
              variant="fadeInUp"
              delay={0.1}
              className="mb-2 w-full text-left"
              disabled={disableAnimation}
            >
              <p className="text-detail-01 text-gray-60">2단계</p>
              <h2 className="text-heading-02-semibold text-gray-100">{title}</h2>
            </AnimatedContainer>

            {/* 흰색 박스 */}
            <AnimatedContainer
              variant="fadeInScale"
              delay={0.2}
              className="border-gray-20 w-full overflow-visible rounded-[16px] border bg-white"
              disabled={disableAnimation}
            >
              {children}
            </AnimatedContainer>
          </div>

          {/* 안내 텍스트와 버튼 (조건부) */}
          {showAction && (
            <AnimatedContainer
              variant="fadeIn"
              delay={0.25}
              className="flex w-full flex-col items-center gap-4"
              disabled={disableAnimation}
            >
              {/* 안내 텍스트 */}
              {guideText && <p className="text-body-02-regular text-gray-60 text-center">{guideText}</p>}

              {/* 버튼 */}
              {buttonText && onButtonClick && (
                <button
                  onClick={onButtonClick}
                  className="text-heading-02-semibold bg-blue-1 h-12 w-72 cursor-pointer rounded-full text-white transition-colors hover:bg-blue-600"
                >
                  {buttonText}
                </button>
              )}
            </AnimatedContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Layout;
