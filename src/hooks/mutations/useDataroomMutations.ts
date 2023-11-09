import { createDataroom, deleteDataroom, updateDataroom } from '@/api/DataroomAPI';
import { CreatedDataroomInfo, UpdatedDataroomInfo } from '@/models/board/Dataroom';
import { useMutation } from '@tanstack/react-query';

export const useCreateDataroom = (createdDataroom: CreatedDataroomInfo) => {
  return useMutation(['/dataroom/create', createdDataroom], () => createDataroom(createdDataroom));
};

export const useUpdateDataroom = (dataId: string, updatedDataroom: UpdatedDataroomInfo) => {
  return useMutation(['/dataroom/update', updatedDataroom], () => updateDataroom(dataId, updatedDataroom));
};

export const useDeleteDataroom = (dataId: string) => {
  return useMutation(['/dataroom/delete', dataId], () => deleteDataroom(dataId));
};
