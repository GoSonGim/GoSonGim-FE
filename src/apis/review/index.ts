import { getRandomWords } from './queries/randomWords';
import { getSituationList } from './queries/situationList';
import { getKitList } from './queries/kitList';
import { getMonthlyStudy } from './queries/monthlyStudy';
import { getDailyStudy } from './queries/dailyStudy';
import { getSituationDetail } from './queries/situationDetail';
import { getKitDetail } from './queries/kitDetail';
import { getKitLogDetail } from './queries/kitLogDetail';
import { evaluateWords } from './mutations/evaluateWords';

export const reviewAPI = {
  getRandomWords,
  getSituationList,
  getKitList,
  getMonthlyStudy,
  getDailyStudy,
  getSituationDetail,
  getKitDetail,
  getKitLogDetail,
  evaluateWords,
};
