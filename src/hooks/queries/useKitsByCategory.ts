import { useQuery } from '@tanstack/react-query';
import { kitAPI } from '@/apis/kit.api';

export const useKitsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['kits', categoryId],
    queryFn: () => kitAPI.getKitsByCategory(categoryId),
    enabled: categoryId > 0, // categoryId가 유효할 때만 실행
  });
};
