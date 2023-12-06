import { getAdminAuthMenuList, getAdminMenuList, getUserAuthMenuList, getUserMenuList } from '@/api/MenuAPI';
import { useQuery } from '@tanstack/react-query';

export const useUserMenuList = () => {
  return useQuery(['/user/menu/list'], () => getUserMenuList());
};

export const useAdminMenuList = () => {
  return useQuery(['/admin/menu/list'], () => getAdminMenuList());
};

export const useUserAuthMenuList = (authId: string) => {
  return useQuery(['/user/auth/menu/list', authId], () => getUserAuthMenuList(authId), { enabled: false });
};

export const useAdminAuthMenuList = (authId: string) => {
  return useQuery(['/admin/auth/menu/list', authId], () => getAdminAuthMenuList(authId), { enabled: false });
};
