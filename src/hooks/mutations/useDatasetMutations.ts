import { createDataset, deleteDataset, updateDataset } from '@/api/DatasetAPI';
import { CreatedDatasetModel, UpdatedDatasetModel } from '@/models/model/DatasetModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateDataset = (createdDataset: CreatedDatasetModel) => {
  return useMutation(['/dataset/create', createdDataset], () => createDataset(createdDataset));
};

export const useUpdateDataset = (mtsId: string, updatedDataset: UpdatedDatasetModel) => {
  return useMutation(['/dataset/update', updatedDataset], () => updateDataset(mtsId, updatedDataset));
};

export const useDeleteDataset = (mtsId: string) => {
  return useMutation(['/dataset/delete', mtsId], () => deleteDataset(mtsId));
};
