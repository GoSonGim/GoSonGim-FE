import { useQuery } from '@tanstack/react-query';
import { situationAPI } from '@/apis/situation.api';

export const useSituations = (category: string) => {
  return useQuery({
    queryKey: ['situations', category],
    queryFn: () => situationAPI.getSituations(category),
  });
};
