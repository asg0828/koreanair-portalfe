import { updateDept } from '@/api/DeptAPI';
import { DeletedDeptModel, UpdatedDeptModel } from '@/models/model/DeptModel';
import { useMutation } from '@tanstack/react-query';

export const useUpdateDept = () => {
  return useMutation((updatedDeptList: Array<UpdatedDeptModel | DeletedDeptModel>) => updateDept(updatedDeptList));
};
