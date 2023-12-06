import { createInterestFeature, deleteInterestFeature, deleteMultipleInterestFeature } from '@/api/FeatureAPI';
import { InterestFeatureParams } from '@/models/model/FeatureModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateInterestFeature = () => {
  return useMutation((params: InterestFeatureParams) => createInterestFeature(params.userId, params.featureId));
};

export const useDeleteInterestFeature = () => {
  return useMutation((params: InterestFeatureParams) => deleteInterestFeature(params.userId, params.featureId));
};

export const useDeleteMultipleInterestFeature = (userId: string, featureIds: Array<string>) => {
  return useMutation(() => deleteMultipleInterestFeature(userId, featureIds));
};
