import { startSession } from './mutations/startSession';
import { replySession } from './mutations/reply';
import { completeSession } from './mutations/completeSession';
import { convertSpeechToText } from './mutations/stt';

export const situationAPI = {
  startSession,
  replySession,
  completeSession,
  convertSpeechToText,
};
