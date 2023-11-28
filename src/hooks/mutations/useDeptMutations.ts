import { createDept, deleteDept, updateDept } from '@/api/DeptAPI';
import { CreatedDeptModel, UpdatedDeptModel } from '@/models/model/DeptModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateDept = (createdDept: CreatedDeptModel) => {
  return useMutation(['/dept/create', createdDept], () => createDept(createdDept));
};

export const useUpdateDept = (deptCode: string, updatedDept: UpdatedDeptModel) => {
  return useMutation(['/dept/update', updatedDept], () => updateDept(deptCode, updatedDept));
};

export const useDeleteDept = (deptCode: string) => {
  return useMutation(['/dept/delete', deptCode], () => deleteDept(deptCode));
};
