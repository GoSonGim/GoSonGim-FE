import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewAPI } from '@/apis/review';
import type { SituationListParams } from '@/types/review';

export const useInfiniteSituationListQuery = (params: Omit<SituationListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['situationReviewList', params.category, params.sort],
    queryFn: ({ pageParam = 1 }) =>
      reviewAPI.getSituationList({
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
