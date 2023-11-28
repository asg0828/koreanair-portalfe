import { createInterestFeature, deleteInterestFeature, deleteMultipleInterestFeature } from '@/api/FeatureAPI';
import { useMutation } from '@tanstack/react-query';

export const useCreateInterestFeature = (userId: string, featureId: string) => {
  return useMutation(['/user-feature/create', userId, featureId], () => createInterestFeature(userId, featureId));
};

export const useDeleteInterestFeature = (userId: string, featureId: string) => {
  return useMutation(['/user-feature/delete', userId, featureId], () => deleteInterestFeature(userId, featureId));
};

export const useDeleteMultipleInterestFeature = (userId: string, featureIds: Array<string>) => {
  return useMutation(['/user-feature/delete', userId, featureIds], () =>
    deleteMultipleInterestFeature(userId, featureIds)
  );
};
