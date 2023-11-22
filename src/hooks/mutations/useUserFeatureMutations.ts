import { createUserFeature, deleteMultipleUserFeature, deleteUserFeature } from '@/api/UserFeatureAPI';
import { useMutation } from '@tanstack/react-query';

export const useCreateUserFeature = (userId: string, featureId: string) => {
  return useMutation(['/user-feature/create', userId, featureId], () => createUserFeature(userId, featureId));
};

export const useDeleteUserFeature = (userId: string, featureId: string) => {
  return useMutation(['/user-feature/delete', userId, featureId], () => deleteUserFeature(userId, featureId));
};

export const useDeleteMultipleUserFeature = (userId: string, featureIds: Array<string>) => {
  return useMutation(['/user-feature/delete', userId, featureIds], () => deleteMultipleUserFeature(userId, featureIds));
};
