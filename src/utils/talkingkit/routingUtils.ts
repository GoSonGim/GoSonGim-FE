// 조음 위치별 키트 매핑 (kitId: 4-7)
export const SOUND_POSITION_MAP: Record<number, string> = {
  4: 'lip-sound',
  5: 'tongue-tip',
  6: 'throat',
  7: 'gum',
};

// 조음 방식별 키트 매핑 (kitId: 8-11)
export const SOUND_WAY_MAP: Record<number, string> = {
  8: 'plosive',
  9: 'fricative',
  10: 'liquid-nasal',
  11: 'jaw-movement',
};

/**
 * kitId를 받아서 올바른 라우팅 경로를 반환.
 * @param kitId - 키트 ID
 * @returns 라우팅 경로
 */
export const getKitRoute = (kitId: number): string => {
  if (SOUND_POSITION_MAP[kitId]) {
    return `/talkingkit/sound-position/${SOUND_POSITION_MAP[kitId]}/step1`;
  } else if (SOUND_WAY_MAP[kitId]) {
    return `/talkingkit/sound-way/${SOUND_WAY_MAP[kitId]}/step1`;
  } else {
    return `/talkingkit/${kitId}`;
  }
};

/**
 * kitId가 조음 위치별 키트인지 확인합니다.
 * @param kitId - 키트 ID
 * @returns 조음 위치별 키트 여부
 */
export const isSoundPositionKit = (kitId: number): boolean => {
  return kitId in SOUND_POSITION_MAP;
};

/**
 * kitId가 조음 방식별 키트인지 확인합니다.
 * @param kitId - 키트 ID
 * @returns 조음 방식별 키트 여부
 */
export const isSoundWayKit = (kitId: number): boolean => {
  return kitId in SOUND_WAY_MAP;
};

/**
 * kitId가 조음 관련 키트인지 확인합니다 (위치 또는 방식).
 * @param kitId - 키트 ID
 * @returns 조음 관련 키트 여부
 */
export const isArticulationKit = (kitId: number): boolean => {
  return isSoundPositionKit(kitId) || isSoundWayKit(kitId);
};
