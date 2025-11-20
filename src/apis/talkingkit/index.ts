import { submitKitEvaluation } from './mutations/evaluation';

// Kit API 재export
export { kitAPI } from './kit';

// Sound Position API (조음 위치별)
export { soundPositionAPI } from './soundPosition';

// TalkingKit evaluation API
export const talkingkitAPI = {
  submitKitEvaluation,
};
