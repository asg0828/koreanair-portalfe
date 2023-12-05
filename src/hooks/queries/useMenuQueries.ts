import { getAdminMenuList, getUserMenuList } from '@/api/MenuAPI';
import { useQuery } from '@tanstack/react-query';

export const useUserMenuList = () => {
  return useQuery(['/user/menu/list'], () => getUserMenuList());
};

export const useAdminMenuList = () => {
  return useQuery(['/admin/menu/list'], () => getAdminMenuList());
};
