import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { FeatureParams } from '@/models/model/FeatureModel';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getFeatureList = (params: FeatureParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        searchConditions: params.searchConditions.join(),
        ...page,
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

export const getFeatureTypList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE_SEPARATES}/all`,
    method: Method.GET,
  });
};

export const getFeatureSeList = (seGrpId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE_SEPARATES}/${seGrpId}`,
    method: Method.GET,
  });
};
