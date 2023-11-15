import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getFeatureList = (searchKey: string, searchValue: string, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}`,
    method: Method.GET,
    params: {
      queryParams: {
        searchConditions: searchKey,
        searchTable: searchValue,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

export const getFeatureById = (featureId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}/${featureId}`,
    method: Method.GET,
  });
};

export const createFeature = (createdFeature: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}`,
    method: Method.POST,
    params: {
      bodyParams: createdFeature,
    },
  });
};

export const updateFeature = (featureId: string, updatedFeature: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}/${featureId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedFeature,
    },
  });
};

export const deleteFeature = (featureId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}/${featureId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        featureId,
      },
    },
  });
};
