import { getFeatureById, getFeatureList } from '@/api/FeatureAPI';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useFeatureList = (searchKey: string, searchValue: string, page: PageModel) => {
  return useQuery(['/feature/list'], () => getFeatureList(searchKey, searchValue, page));
};

export const useFeatureById = (featureId: string) => {
  return useQuery(['/feature', featureId], () => getFeatureById(featureId));
};
