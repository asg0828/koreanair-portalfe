import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { AuthParams } from '@/models/model/AuthModel';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getUserAuthAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MGMT}/all`,
    method: Method.GET,
  });
};

export const getUserAuthList = (params: AuthParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MGMT}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        ...page,
      },
    },
  });
};

export const getUserAuthById = (authId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MGMT}/${authId}`,
    method: Method.GET,
  });
};

export const createUserAuth = (createdUserAuth: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: createdUserAuth,
    },
  });
};

export const updateUserAuth = (authId: string, updatedUserAuth: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MGMT}/${authId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedUserAuth,
    },
  });
};

export const deleteUserAuth = (authId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MGMT}/${authId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        authId,
      },
    },
  });
};

export const getAdminAuthAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MGMT}/all`,
    method: Method.GET,
  });
};

export const getAdminAuthList = (params: AuthParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MGMT}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        ...page,
      },
    },
  });
};

export const getAdminAuthById = (authId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MGMT}/${authId}`,
    method: Method.GET,
  });
};

export const createAdminAuth = (createdUserAuth: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: createdUserAuth,
    },
  });
};

export const updateAdminAuth = (authId: string, updatedUserAuth: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MGMT}/${authId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedUserAuth,
    },
  });
};

export const deleteAdminAuth = (authId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MGMT}/${authId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        authId,
      },
    },
  });
};
