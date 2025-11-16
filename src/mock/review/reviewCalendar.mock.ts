export interface Kit {
  id: string;
  name: string;
  canRestudy: boolean;
  hasRecording: boolean;
}

export interface DailyStudyRecord {
  date: string; // 'YYYY-MM-DD'
  kits: Kit[];
}

export const MOCK_STUDY_RECORDS: DailyStudyRecord[] = [
  {
    date: '2025-10-02',
    kits: [{ id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true }],
  },
  {
    date: '2025-10-04',
    kits: [
      { id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true },
      { id: '2', name: '길게 소리내기 키트', canRestudy: true, hasRecording: false },
    ],
  },
  {
    date: '2025-10-05',
    kits: [{ id: '3', name: '턱 움직임 키트', canRestudy: false, hasRecording: true }],
  },
  {
    date: '2025-10-06',
    kits: [
      { id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true },
      { id: '2', name: '길게 소리내기 키트', canRestudy: true, hasRecording: true },
      { id: '3', name: '턱 움직임 키트', canRestudy: true, hasRecording: true },
    ],
  },
  {
    date: '2025-10-10',
    kits: [{ id: '2', name: '길게 소리내기 키트', canRestudy: true, hasRecording: true }],
  },
  {
    date: '2025-10-11',
    kits: [{ id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true }],
  },
  {
    date: '2025-10-13',
    kits: [{ id: '3', name: '턱 움직임 키트', canRestudy: true, hasRecording: false }],
  },
  {
    date: '2025-10-16',
    kits: [
      { id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true },
      { id: '2', name: '길게 소리내기 키트', canRestudy: true, hasRecording: true },
    ],
  },
  {
    date: '2025-10-18',
    kits: [{ id: '2', name: '길게 소리내기 키트', canRestudy: true, hasRecording: true }],
  },
  {
    date: '2025-10-20',
    kits: [{ id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true }],
  },
  {
    date: '2025-10-23',
    kits: [{ id: '3', name: '턱 움직임 키트', canRestudy: true, hasRecording: true }],
  },
  {
    date: '2025-10-25',
    kits: [
      { id: '1', name: '목구멍 소리 키트', canRestudy: true, hasRecording: true },
      { id: '2', name: '길게 소리내기 키트', canRestudy: true, hasRecording: true },
    ],
  },
];
