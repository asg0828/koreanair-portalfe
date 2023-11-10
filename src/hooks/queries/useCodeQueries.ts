import { getCodeGroupAllList, getCodeList, getCodeGroupById, getCodeById } from '@/api/CodeAPI';
import { useQuery } from '@tanstack/react-query';

export const useCodeGroupAllList = () => {
  return useQuery(['/code-group/list/all'], () => getCodeGroupAllList());
};

export const useCodeList = (groupId: string) => {
  return useQuery(['/code/list', groupId], () => getCodeList(groupId));
};

export const useCodeGroupById = (groupId: string) => {
  return useQuery(['/code-group', groupId], () => getCodeGroupById(groupId));
};

export const useCodeById = (groupId: string, codeId: string) => {
  return useQuery(['/code', groupId], () => getCodeById(groupId, codeId));
};
