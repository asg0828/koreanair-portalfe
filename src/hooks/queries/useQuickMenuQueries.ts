import { getQuickMenuList } from '@/api/QuickMenuAPI';
import { useQuery } from '@tanstack/react-query';

export const useQuickMenuList = (userId: string) => {
  return useQuery(['/user/quick-menu/list'], () => getQuickMenuList(userId), { suspense: false, enabled: false });
};
