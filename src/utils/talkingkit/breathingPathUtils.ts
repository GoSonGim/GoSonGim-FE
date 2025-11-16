import { BLUE_PATH_START, INITIAL_BALL_POSITION } from '@/constants/talkingkit/breathing';
import { logger } from '@/utils/loggerUtils';

/**
 * SVG 경로를 따라 특정 진행률의 위치를 계산
 * @param pathElement SVG 경로 요소
 * @param progress 진행률 (0~1)
 * @param startOffset 시작 오프셋 (기본값: 0)
 * @returns 위치 좌표 또는 null
 */
export const calculatePathPosition = (
  pathElement: SVGPathElement | null,
  progress: number,
  startOffset: number = 0,
): { x: number; y: number } | null => {
  if (!pathElement) return null;

  try {
    const pathLength = pathElement.getTotalLength();
    const adjustedProgress = startOffset + progress * (1 - startOffset);
    const point = pathElement.getPointAtLength(pathLength * adjustedProgress);
    return { x: point.x, y: point.y };
  } catch (error) {
    logger.error('Error calculating path position:', error);
    return null;
  }
};

/**
 * 초기 공 위치 계산 (파란색 경로의 시작 지점)
 * @param bluePath 파란색 경로 요소
 * @returns 초기 위치 좌표
 */
export const getInitialBallPosition = (bluePath: SVGPathElement | null): { x: number; y: number } => {
  const position = calculatePathPosition(bluePath, BLUE_PATH_START, 0);
  return position || INITIAL_BALL_POSITION;
};

/**
 * 파란색 경로를 따라 공의 위치 계산
 * @param bluePath 파란색 경로 요소
 * @param progress 진행률 (0~0.5, 전체 애니메이션의 절반)
 * @returns 위치 좌표
 */
export const calculateBluePathPosition = (
  bluePath: SVGPathElement | null,
  progress: number,
): { x: number; y: number } => {
  // progress 0~0.5를 0.2~1.0으로 매핑
  const blueProgress = BLUE_PATH_START + progress * 2 * (1 - BLUE_PATH_START);
  const position = calculatePathPosition(bluePath, blueProgress, 0);
  return position || INITIAL_BALL_POSITION;
};

/**
 * 빨간색 경로를 따라 공의 위치 계산
 * @param redPath 빨간색 경로 요소
 * @param progress 진행률 (0.5~1.0, 전체 애니메이션의 후반부)
 * @returns 위치 좌표
 */
export const calculateRedPathPosition = (
  redPath: SVGPathElement | null,
  progress: number,
): { x: number; y: number } => {
  // progress 0.5~1.0을 0~1.0으로 매핑
  const redProgress = (progress - 0.5) * 2;
  const position = calculatePathPosition(redPath, redProgress, 0);
  return position || INITIAL_BALL_POSITION;
};
