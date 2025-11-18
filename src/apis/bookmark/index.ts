import { addKitBookmark } from './mutations/addKit';
import { addSituationBookmark } from './mutations/addSituation';
import { removeBookmark } from './mutations/remove';
import { getBookmarkList } from './queries/list';
import { getBookmarkPreview } from './queries/preview';

export const bookmarkAPI = {
  addKitBookmark,
  addSituationBookmark,
  removeBookmark,
  getBookmarkList,
  getBookmarkPreview,
};

