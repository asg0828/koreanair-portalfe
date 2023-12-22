import {
  getFeatureAllList,
  getFeatureById,
  getFeatureList,
  getFeatureSeList,
  getFeatureTypList,
  getInterestFeatureList,
  getPopularFeatureList,
} from '@/api/FeatureAPI';
import { FeatureAllParams, FeatureParams } from '@/models/model/FeatureModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useFeatureAllList = (params: FeatureAllParams, options?: Object) => {
  return useQuery(['/feature/all/list', params], () => getFeatureAllList(params), options);
};

export const useFeatureList = (params: FeatureParams, page: PageModel, options?: Object) => {
  return useQuery(['/feature/list', options], () => getFeatureList(params, page), options);
};

export const useInterestFeatureList = (userId: string, page: PageModel) => {
  return useQuery(['/interest/feature/list'], () => getInterestFeatureList(userId, page));
};

export const usePopularFeatureList = (options?: Object) => {
  return useQuery(['/popular/feature/list', options], () => getPopularFeatureList(), options);
};

export const useFeatureById = (featureId: string) => {
  return useQuery(['/feature', featureId], () => getFeatureById(featureId), { enabled: !!featureId });
};

export const useFeatureTypList = () => {
  return useQuery(['/feature-separates/list'], () => getFeatureTypList(), { suspense: false });
};

export const useFeatureSeList = (seGrpId: string) => {
  return useQuery(['/feature-separates', seGrpId], () => getFeatureSeList(seGrpId), {
    suspense: false,
    enabled: false,
  });
};
