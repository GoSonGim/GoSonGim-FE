import { useQuery } from '@tanstack/react-query';
import { kitAPI } from '@/apis/talkingkit';

export const useKitCategories = () => {
  return useQuery({
    queryKey: ['kitCategories'],
    queryFn: () => kitAPI.getCategories(),
  });
};
