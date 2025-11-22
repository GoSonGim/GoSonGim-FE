import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';
import type { KitListParams } from '@/types/review';

export const useInfiniteKitListQuery = (params: Omit<KitListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['kitReviewList', params.category, params.sort],
    queryFn: ({ pageParam = 1 }) =>
      reviewAPI.getKitList({
        ...params,
        page: pageParam,
        size: params.size || 20,
      }),
    getNextPageParam: (lastPage) => {
      const { pageInfo } = lastPage.result;
      return pageInfo.hasNext ? pageInfo.page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnMount: 'always',
  });
};
