import { getUserEGroupAllList, getUserEGroupUserList } from '@/api/GroupAPI';
import { useQuery } from '@tanstack/react-query';

export const useUserEGroupAllList = () => {
  return useQuery(['/user/egroup/all/list'], () => getUserEGroupAllList());
};

export const useUserEGroupUserList = (groupCode: string) => {
  return useQuery(['/user/egroup/user/list', groupCode], () => getUserEGroupUserList(groupCode), {
    suspense: false,
    enabled: !!groupCode,
  });
};
