import { getDataroomById, getDataroomList } from '@/api/DataroomAPI';
import { PageInfo } from '@/models/components/Page';
import { useQuery } from '@tanstack/react-query';

export const useDataroomList = (searchKey: string, searchValue: string, page: PageInfo) => {
  return useQuery(['/dataroom/list'], () => getDataroomList(searchKey, searchValue, page));
};

export const useDataroomById = (dataId: string) => {
  return useQuery(['/dataroom', dataId], () => getDataroomById(dataId));
};
