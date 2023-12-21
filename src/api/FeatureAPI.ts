import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { FeatureAllParams, FeatureParams } from '@/models/model/FeatureModel';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getFeatureAllList = (params: FeatureAllParams) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FEATURE}/all`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
      },
    },
  });
};

export const getFeatureList = (params: FeatureParams, page: PageModel) => {
  console.log('----: ', page);
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

export const getInterestFeatureList = (userId: string, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/features`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
      },
    },
  });
};

export const createInterestFeature = (userId: string, featureId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/features`,
    method: Method.POST,
    params: {
      bodyParams: {
        featureId,
      },
    },
  });
};

export const deleteInterestFeature = (userId: string, featureId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/features/${featureId}`,
    method: Method.DELETE,
  });
};

export const deleteMultipleInterestFeature = (userId: string, featureIds: Array<string>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/features`,
    method: Method.DELETE,
    params: {
      queryParams: {
        featureIds: featureIds.join(),
      },
    },
  });
};

export const getPopularFeatureList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.POPULAR_FEATURE}`,
    method: Method.GET,
  });
};
