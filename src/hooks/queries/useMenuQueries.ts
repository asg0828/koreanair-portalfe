import { getAdminAuthMenuList, getAdminMenuList, getUserAuthMenuList, getUserMenuList } from '@/api/MenuAPI';
import { useQuery } from '@tanstack/react-query';

export const useUserMenuList = (key?: string) => {
  return useQuery(['/user/menu/list', key], () => getUserMenuList());
};

export const useAdminMenuList = (key?: string) => {
  return useQuery(['/admin/menu/list', key], () => getAdminMenuList());
};

export const useUserAuthMenuList = (authId: string) => {
  return useQuery(['/user/auth/menu/list', authId], () => getUserAuthMenuList(authId), { enabled: false });
};

export const useAdminAuthMenuList = (authId: string) => {
  return useQuery(['/admin/auth/menu/list', authId], () => getAdminAuthMenuList(authId), { enabled: false });
};
