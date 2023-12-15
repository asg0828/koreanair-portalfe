import { getDatasetById, getDatasetList } from '@/api/DatasetAPI';
import { DatasetParams } from '@/models/model/DatasetModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useDatasetList = (params: DatasetParams, page: PageModel) => {
  return useQuery(['/dataset/list'], () => getDatasetList(params, page));
};

export const useDatasetById = (mtsId: string) => {
  return useQuery(['/dataset', mtsId], () => getDatasetById(mtsId), { enabled: !!mtsId });
};
