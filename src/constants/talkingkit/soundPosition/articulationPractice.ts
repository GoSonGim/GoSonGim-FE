export interface PracticeWord {
  round: number;
  word: string;
  category: string;
  kitStageId: number;
}

// 조음 위치별 + 조음 방법별 통합 타입
export type ArticulationType =
  | 'lip-sound'
  | 'tongue-tip'
  | 'throat'
  | 'gum' // 위치별
  | 'plosive'
  | 'fricative'
  | 'liquid-nasal'
  | 'jaw-movement'; // 방법별

// 통합 단어 데이터
export const articulationPracticeWords: Record<ArticulationType, PracticeWord[]> = {
  // 조음 위치별 (1-12)
  'lip-sound': [
    { round: 1, word: '마음', category: '명사', kitStageId: 1 },
    { round: 2, word: '바다', category: '명사', kitStageId: 2 },
    { round: 3, word: '포도', category: '명사', kitStageId: 3 },
  ],
  'tongue-tip': [
    { round: 1, word: '나비', category: '명사', kitStageId: 4 },
    { round: 2, word: '다리', category: '명사', kitStageId: 5 },
    { round: 3, word: '라면', category: '명사', kitStageId: 6 },
  ],
  throat: [
    { round: 1, word: '호수', category: '명사', kitStageId: 7 },
    { round: 2, word: '강', category: '명사', kitStageId: 8 },
    { round: 3, word: '커피', category: '명사', kitStageId: 9 },
  ],
  gum: [
    { round: 1, word: '나무', category: '명사', kitStageId: 10 },
    { round: 2, word: '도시', category: '명사', kitStageId: 11 },
    { round: 3, word: '리본', category: '명사', kitStageId: 12 },
  ],

  // 조음 방법별 (13-24)
  plosive: [
    { round: 1, word: '고기', category: '명사', kitStageId: 13 },
    { round: 2, word: '가방', category: '명사', kitStageId: 14 },
    { round: 3, word: '토끼', category: '명사', kitStageId: 15 },
  ],
  fricative: [
    { round: 1, word: '사자', category: '명사', kitStageId: 16 },
    { round: 2, word: '수박', category: '명사', kitStageId: 17 },
    { round: 3, word: '산책', category: '명사', kitStageId: 18 },
  ],
  'liquid-nasal': [
    { round: 1, word: '음식', category: '명사', kitStageId: 19 },
    { round: 2, word: '모자', category: '명사', kitStageId: 20 },
    { round: 3, word: '노래', category: '명사', kitStageId: 21 },
  ],
  'jaw-movement': [
    { round: 1, word: '아기', category: '명사', kitStageId: 22 },
    { round: 2, word: '운동', category: '명사', kitStageId: 23 },
    { round: 3, word: '우산', category: '명사', kitStageId: 24 },
  ],
};

// 통합 메타데이터
export const articulationTypeConfig: Record<ArticulationType, { name: string; videoFile: string }> = {
  // 조음 위치별
  'lip-sound': { name: '입술 소리', videoFile: 'articulation-position-1.mp4' },
  'tongue-tip': { name: '혀끝 소리', videoFile: 'articulation-position-2.mp4' },
  throat: { name: '목구멍 소리', videoFile: 'articulation-position-3.mp4' },
  gum: { name: '잇몸 소리', videoFile: 'articulation-position-4.mp4' },

  // 조음 방법별
  plosive: { name: '파열음', videoFile: 'articulation-method-1.mp4' },
  fricative: { name: '마찰음', videoFile: 'articulation-method-2.mp4' },
  'liquid-nasal': { name: '유음/비음', videoFile: 'articulation-method-3.mp4' },
  'jaw-movement': { name: '턱 움직임', videoFile: 'articulation-method-4.mp4' },
};

// 하위 호환성을 위한 별칭 export (기존 코드가 사용 중)
export type SoundType = Extract<ArticulationType, 'lip-sound' | 'tongue-tip' | 'throat' | 'gum'>;
export const soundTypeConfig = articulationTypeConfig as Record<SoundType, { name: string; videoFile: string }>;
