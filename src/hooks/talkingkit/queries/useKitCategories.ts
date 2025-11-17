import { useQuery } from '@tanstack/react-query';
import { kitAPI } from '@/apis/kit.api';

export const useKitCategories = () => {
  return useQuery({
    queryKey: ['kitCategories'],
    queryFn: () => kitAPI.getCategories(),
  });
};
