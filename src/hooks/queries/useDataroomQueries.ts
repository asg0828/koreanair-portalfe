import { getDataroomById, getDataroomList } from '@/api/DataroomAPI';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useDataroomList = (searchKey: string, searchValue: string, page: PageModel) => {
  return useQuery(['/dataroom/list'], () => getDataroomList(searchKey, searchValue, page));
};

export const useDataroomById = (dataId: string) => {
  return useQuery(['/dataroom', dataId], () => getDataroomById(dataId));
};
