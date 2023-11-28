import { createDataroom, deleteDataroom, updateDataroom } from '@/api/DataroomAPI';
import { CreatedDataroomModel, UpdatedDataroomModel } from '@/models/model/DataroomModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateDataroom = (createdDataroom: CreatedDataroomModel) => {
  return useMutation(() => createDataroom(createdDataroom));
};

export const useUpdateDataroom = (dataId: string, updatedDataroom: UpdatedDataroomModel) => {
  return useMutation(() => updateDataroom(dataId, updatedDataroom));
};

export const useDeleteDataroom = (dataId: string) => {
  return useMutation(() => deleteDataroom(dataId));
};
