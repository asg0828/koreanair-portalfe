import { createInterestFeature, deleteInterestFeature, deleteMultipleInterestFeature } from '@/api/FeatureAPI';
import { useMutation } from '@tanstack/react-query';

export const useCreateInterestFeature = (userId: string, featureId: string) => {
  return useMutation(() => createInterestFeature(userId, featureId));
};

export const useDeleteInterestFeature = (userId: string, featureId: string) => {
  return useMutation(() => deleteInterestFeature(userId, featureId));
};

export const useDeleteMultipleInterestFeature = (userId: string, featureIds: Array<string>) => {
  return useMutation(() => deleteMultipleInterestFeature(userId, featureIds));
};
