import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getUserFeatureList = (userId: string, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_FEATURE}/${userId}/features`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
      },
    },
  });
};

export const createUserFeature = (userId: string, featureId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_FEATURE}/${userId}/features`,
    method: Method.POST,
    params: {
      bodyParams: {
        featureId,
      },
    },
  });
};

export const deleteUserFeature = (userId: string, featureId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_FEATURE}/${userId}/features/${featureId}`,
    method: Method.DELETE,
  });
};

export const deleteMultipleUserFeature = (userId: string, featureIds: Array<string>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_FEATURE}/${userId}/features`,
    method: Method.DELETE,
    params: {
      queryParams: {
        featureIds: featureIds.join(),
      },
    },
  });
};
