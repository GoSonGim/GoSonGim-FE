import { useState } from 'react';
import { useAddKitBookmarkMutation } from '@/hooks/bookmark/mutations/useAddKitBookmarkMutation';
import { useRemoveBookmarkMutation } from '@/hooks/bookmark/mutations/useRemoveBookmarkMutation';
import { useBookmarkStatus } from '@/hooks/bookmark/useBookmarkStatus';
import { logger } from '@/utils/common/loggerUtils';
import type { KitDiagnosisResponse } from '@/types/talkingkit';

export const useKitDiagnosisBookmark = () => {
  const [savedKits, setSavedKits] = useState<Set<number>>(new Set());
  const addKitBookmarkMutation = useAddKitBookmarkMutation();
  const removeBookmarkMutation = useRemoveBookmarkMutation();
  const { getBookmarkStatus } = useBookmarkStatus('KIT');

  const handleToggleSaveKit = async (kitId: number) => {
    const isCurrentlySaved = savedKits.has(kitId);

    if (isCurrentlySaved) {
      // 이미 저장된 경우 API 호출하여 북마크 제거
      const { bookmarkId } = getBookmarkStatus(kitId);

      if (bookmarkId) {
        try {
          await removeBookmarkMutation.mutateAsync(bookmarkId);
          setSavedKits((prev) => {
            const newSet = new Set(prev);
            newSet.delete(kitId);
            return newSet;
          });
          logger.log('키트 북마크 제거 성공:', kitId);
        } catch (error) {
          logger.error('키트 북마크 제거 실패:', error);
        }
      } else {
        // bookmarkId를 찾지 못한 경우 UI에서만 제거
        setSavedKits((prev) => {
          const newSet = new Set(prev);
          newSet.delete(kitId);
          return newSet;
        });
      }
    } else {
      // 저장되지 않은 경우 API 호출하여 북마크 추가
      try {
        await addKitBookmarkMutation.mutateAsync({ kitList: [kitId] });
        setSavedKits((prev) => new Set(prev).add(kitId));
        logger.log('키트 북마크 추가 성공:', kitId);
      } catch (error) {
        logger.error('키트 북마크 추가 실패:', error);
      }
    }
  };

  const handleSaveAll = async (diagnosisResult: KitDiagnosisResponse['result'] | null) => {
    if (diagnosisResult?.recommendedKits && diagnosisResult.recommendedKits.length > 0) {
      const allKitIds = diagnosisResult.recommendedKits.map((kit) => kit.kitId);

      try {
        // API 호출하여 모든 키트를 북마크에 추가
        await addKitBookmarkMutation.mutateAsync({ kitList: allKitIds });
        setSavedKits(new Set(allKitIds));
        logger.log('모든 키트 북마크 추가 성공:', allKitIds);
      } catch (error) {
        logger.error('모든 키트 북마크 추가 실패:', error);
      }
    }
  };

  const resetSavedKits = () => {
    setSavedKits(new Set());
  };

  return {
    savedKits,
    handleToggleSaveKit,
    handleSaveAll,
    resetSavedKits,
  };
};

