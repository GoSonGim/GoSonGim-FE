/**
 * 짧은 소리 발성 연습 관련 상수
 */

/** 목표 발음 지점 (ms) - [2초, 4초] */
export const TARGET_POINTS: [number, number] = [2000, 4000];

/** 애니메이션 지속 시간 (ms) */
export const DURATION = 6000;

/** 중복 감지 방지 시간 (ms) - 100ms 이내 같은 소리는 무시 */
export const DUPLICATE_DETECTION_THRESHOLD = 100;

/** 목표 지점 허용 오차 (ms) */
export const TARGET_POINT_TOLERANCE = 1000;
