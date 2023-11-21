import { createDataroom, deleteDataroom, updateDataroom } from '@/api/DataroomAPI';
import { CreatedDataroomModel, UpdatedDataroomModel } from '@/models/model/DataroomModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateDataroom = (createdDataroom: CreatedDataroomModel) => {
  return useMutation(['/dataroom/create', createdDataroom], () => createDataroom(createdDataroom));
};

export const useUpdateDataroom = (dataId: string, updatedDataroom: UpdatedDataroomModel) => {
  return useMutation(['/dataroom/update', updatedDataroom], () => updateDataroom(dataId, updatedDataroom));
};

export const useDeleteDataroom = (dataId: string) => {
  return useMutation(['/dataroom/delete', dataId], () => deleteDataroom(dataId));
};
