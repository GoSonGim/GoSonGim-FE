import { getRandomWords } from './queries/randomWords';
import { getSituationList } from './queries/situationList';
import { getKitList } from './queries/kitList';
import { getMonthlyStudy } from './queries/monthlyStudy';
import { getDailyStudy } from './queries/dailyStudy';

export const reviewAPI = {
  getRandomWords,
  getSituationList,
  getKitList,
  getMonthlyStudy,
  getDailyStudy,
};
