import { getUserFeatureList } from '@/api/UserFeatureAPI';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useUserFeatureList = (userId: string, page: PageModel) => {
  return useQuery(['/user-feature/list'], () => getUserFeatureList(userId, page));
};
