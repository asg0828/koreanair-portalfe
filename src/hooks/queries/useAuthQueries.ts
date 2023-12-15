import {
  getAdminAuthAllList,
  getAdminAuthById,
  getAdminAuthList,
  getUserAuthAllList,
  getUserAuthById,
  getUserAuthList,
} from '@/api/AuthAPI';
import { AuthParams } from '@/models/model/AuthModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useUserAuthAllList = (options?: Object) => {
  return useQuery(['/user/auth/list/all'], getUserAuthAllList, options);
};

export const useUserAuthList = (params: AuthParams, page: PageModel) => {
  return useQuery(['/user/auth/list'], () => getUserAuthList(params, page));
};

export const useUserAuthById = (authId: string) => {
  return useQuery(['/user/auth', authId], () => getUserAuthById(authId), { enabled: !!authId });
};

export const useAdminAuthAllList = (options?: Object) => {
  return useQuery(['/admin/auth/list/all'], getAdminAuthAllList, options);
};

export const useAdminAuthList = (params: AuthParams, page: PageModel) => {
  return useQuery(['/admin/auth/list'], () => getAdminAuthList(params, page));
};

export const useAdminAuthById = (authId: string) => {
  return useQuery(['/admin/auth', authId], () => getAdminAuthById(authId), { enabled: !!authId });
};
