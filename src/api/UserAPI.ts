import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { UserParams } from '@/models/model/UserModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getUserAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}`,
    method: Method.GET,
  });
};

export const getUserList = (params: UserParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        ...page,
      },
    },
  });
};

export const getUserById = (userId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}`,
    method: Method.GET,
  });
};

export const createUser = (createdUser: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: createdUser,
    },
  });
};

export const updateUser = (userId: string, updatedUser: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedUser,
    },
  });
};

export const deleteUser = (userId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        userId,
      },
    },
  });
};
