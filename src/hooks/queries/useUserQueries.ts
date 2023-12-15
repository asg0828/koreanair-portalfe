import { getUserAllList, getUserById, getUserList } from '@/api/UserAPI';
import { PageModel } from '@/models/model/PageModel';
import { UserParams } from '@/models/model/UserModel';
import { useQuery } from '@tanstack/react-query';

export const useUserAllList = () => {
  return useQuery(['/user/list/all'], getUserAllList, { suspense: false });
};

export const useUserList = (params: UserParams, page: PageModel) => {
  return useQuery(['/user/list'], () => getUserList(params, page));
};

export const useUserById = (userId: string) => {
  return useQuery(['/user', userId], () => getUserById(userId), { enabled: !!userId });
};
