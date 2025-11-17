import { useQuery } from '@tanstack/react-query';
import { situationAPI } from '@/apis/search';

export const useSituations = (category: string) => {
  return useQuery({
    queryKey: ['situations', category],
    queryFn: () => situationAPI.getSituations(category),
  });
};
