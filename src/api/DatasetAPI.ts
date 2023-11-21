import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { DatasetParams } from '@/models/model/DatasetModel';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getDatasetList = (params: DatasetParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATASET}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        dataSetConditions: params.dataSetConditions.join(),
        ...page,
      },
    },
  });
};

export const getDatasetById = (mtsId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATASET}/${mtsId}`,
    method: Method.GET,
  });
};

export const createDataset = (createdDataset: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATASET}`,
    method: Method.POST,
    params: {
      bodyParams: createdDataset,
    },
  });
};

export const updateDataset = (mtsId: string, updatedDataset: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATASET}/${mtsId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedDataset,
    },
  });
};

export const deleteDataset = (mtsId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATASET}/${mtsId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        mtsId,
      },
    },
  });
};
