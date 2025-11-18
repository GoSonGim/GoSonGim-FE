import { useState } from 'react';
import axios from 'axios';
import { usePresignedUrlMutation } from './mutations/usePresignedUrlMutation';
import { logger } from '@/utils/common/loggerUtils';

interface UseFileUploadReturn {
  uploadFile: (file: Blob, folder: string, fileName: string) => Promise<string>;
  isUploading: boolean;
  uploadError: string | null;
}

/**
 * 파일 업로드 통합 훅
 * 1. Presigned URL 발급
 * 2. S3에 파일 직접 업로드
 * 3. fileKey 반환
 */
export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const presignedUrlMutation = usePresignedUrlMutation();

  const uploadFile = async (file: Blob, folder: string, fileName: string): Promise<string> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      logger.log('[FILE UPLOAD] Step 1: Presigned URL 발급 요청', { folder, fileName });
      
      // 1. Presigned URL 발급
      const presignedUrlResponse = await presignedUrlMutation.mutateAsync({
        folder,
        fileName,
      });

      const { url, fileKey } = presignedUrlResponse.result;
      
      logger.log('[FILE UPLOAD] Step 2: Presigned URL 발급 완료', { fileKey, url: url.substring(0, 100) + '...' });

      // 2. S3에 파일 업로드
      logger.log('[FILE UPLOAD] Step 3: S3 업로드 시작', { fileSize: file.size });
      
      await axios.put(url, file, {
        headers: {
          'Content-Type': 'audio/wav',
        },
      });

      logger.log('[FILE UPLOAD] Step 4: S3 업로드 완료', { fileKey });

      setIsUploading(false);
      return fileKey;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '파일 업로드 실패';
      logger.error('[FILE UPLOAD] 업로드 실패:', error);
      setUploadError(errorMessage);
      setIsUploading(false);
      throw error;
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadError,
  };
};

