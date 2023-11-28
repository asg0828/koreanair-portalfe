import {
  getFeatureById,
  getFeatureList,
  getFeatureSeList,
  getFeatureTypList,
  getInterestFeatureList,
  getPopularFeatureList,
} from '@/api/FeatureAPI';
import { FeatureParams } from '@/models/model/FeatureModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useFeatureList = (params: FeatureParams, page: PageModel) => {
  return useQuery(['/feature/list'], () => getFeatureList(params, page));
};

export const useInterestFeatureList = (userId: string, page: PageModel) => {
  return useQuery(['/interest/feature/list'], () => getInterestFeatureList(userId, page));
};

export const usePopularFeatureList = () => {
  return useQuery(['/popular/feature/list'], () => getPopularFeatureList());
};

export const useFeatureById = (featureId: string) => {
  return useQuery(['/feature', featureId], () => getFeatureById(featureId));
};

export const useFeatureTypList = () => {
  return useQuery(['/feature-separates/list'], () => getFeatureTypList());
};

export const useFeatureSeList = (seGrpId: string) => {
  return useQuery(['/feature-separates', seGrpId], () => getFeatureSeList(seGrpId), { enabled: false });
};
