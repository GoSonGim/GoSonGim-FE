import { getCategories } from './queries/categories';
import { getKitsByCategory } from './queries/list';
import { getKitDetail } from './queries/detail';
import { getUploadUrl } from './queries/uploadUrl';
import { saveKitStageLog } from './mutations/stageLog';
import { diagnosisKit } from './mutations/diagnosis';

export const kitAPI = {
  getCategories,
  getKitsByCategory,
  getKitDetail,
  getUploadUrl,
  saveKitStageLog,
  diagnosisKit,
};

