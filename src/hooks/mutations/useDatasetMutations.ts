import { createDataset, deleteDataset, updateDataset } from '@/api/DatasetAPI';
import { CreatedDatasetModel, UpdatedDatasetModel } from '@/models/model/DatasetModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateDataset = (createdDataset: CreatedDatasetModel) => {
  return useMutation(() => createDataset(createdDataset));
};

export const useUpdateDataset = (mtsId: string, updatedDataset: UpdatedDatasetModel) => {
  return useMutation(() => updateDataset(mtsId, updatedDataset));
};

export const useDeleteDataset = (mtsId: string) => {
  return useMutation(() => deleteDataset(mtsId));
};
