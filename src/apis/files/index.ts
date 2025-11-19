import { getPresignedUrl } from './mutations/presignedUrl';
import { deleteFile } from './mutations/deleteFile';
import { getDownloadUrl } from './queries/downloadUrl';

export const filesAPI = {
  getPresignedUrl,
  deleteFile,
  getDownloadUrl,
};

