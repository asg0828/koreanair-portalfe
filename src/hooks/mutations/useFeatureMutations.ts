import { createFeature, deleteFeature, updateFeature } from '@/api/FeatureAPI';
import { CreatedFeatureModel, UpdatedFeatureModel } from '@/models/model/FeatureModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateFeature = (createdFeature: CreatedFeatureModel) => {
  return useMutation(['/feature/create', createdFeature], () => createFeature(createdFeature));
};

export const useUpdateFeature = (featureId: string, updatedFeature: UpdatedFeatureModel) => {
  return useMutation(['/feature/update', updatedFeature], () => updateFeature(featureId, updatedFeature));
};

export const useDeleteFeature = (featureId: string) => {
  return useMutation(['/feature/delete', featureId], () => deleteFeature(featureId));
};
