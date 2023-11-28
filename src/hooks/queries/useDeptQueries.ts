import { getDeptAllList, getDeptById, getDeptList } from '@/api/DeptAPI';
import { DeptParams } from '@/models/model/DeptModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useDeptAllList = () => {
  return useQuery(['/dept/list/all'], getDeptAllList, { suspense: false });
};

export const useDeptList = (params: DeptParams, page: PageModel) => {
  return useQuery(['/dept/list'], () => getDeptList(params, page));
};

export const useDeptById = (deptCode: string) => {
  return useQuery(['/dept', deptCode], () => getDeptById(deptCode));
};
