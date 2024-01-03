import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

export const getBizMeta = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.HOME}/biz-meta-count`,
    method: Method.GET,
  });
};

export const getFeatureMyDept = (userId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.HOME}/users/${userId}/features-mydept`,
    method: Method.GET,
  });
};

export const getLoginUserDept = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.HOME}/login-user-dept`,
    method: Method.GET,
  });
};

export const getLoginInfo = (userId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.HOME}/login-info/${userId}`,
    method: Method.GET,
  });
};

