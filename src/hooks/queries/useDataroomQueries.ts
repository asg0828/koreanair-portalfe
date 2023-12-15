import { getDataroomById, getDataroomList } from '@/api/DataroomAPI';
import { DataroomParams } from '@/models/model/DataroomModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useDataroomList = (params: DataroomParams, page: PageModel) => {
  return useQuery(['/dataroom/list'], () => getDataroomList(params, page));
};

export const useDataroomById = (dataId: string) => {
  return useQuery(['/dataroom', dataId], () => getDataroomById(dataId), { enabled: !!dataId });
};
