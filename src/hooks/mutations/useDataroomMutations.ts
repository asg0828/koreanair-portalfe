import { createDataroom, deleteDataroom, updateDataroom } from '@/api/DataroomAPI';
import { CreatedDataroomModel, UpdatedDataroomModel } from '@/models/model/DataroomModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateDataroom = () => {
  return useMutation((createdDataroom: CreatedDataroomModel) => createDataroom(createdDataroom));
};

export const useUpdateDataroom = () => {
  return useMutation((updatedDataroom: UpdatedDataroomModel) =>
    updateDataroom(updatedDataroom.dataId, updatedDataroom)
  );
};

export const useDeleteDataroom = (dataId: string) => {
  return useMutation(() => deleteDataroom(dataId));
};
