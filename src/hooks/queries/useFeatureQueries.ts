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

export const useFeatureList = (params: FeatureParams, page: PageModel, options?: Object) => {
  return useQuery(['/feature/list'], () => getFeatureList(params, page), options);
};

export const useInterestFeatureList = (userId: string, page: PageModel) => {
  return useQuery(['/interest/feature/list'], () => getInterestFeatureList(userId, page));
};

export const usePopularFeatureList = (options?: Object) => {
  return useQuery(['/popular/feature/list'], () => getPopularFeatureList(), options);
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
