import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

export const getQuickMenuList = (userId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/quick-menus`,
    method: Method.GET,
  });
};

export const createQuickMenu = (userId: string, menuId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/quick-menus`,
    method: Method.POST,
    params: {
      bodyParams: {
        menuId,
      },
    },
  });
};

export const deleteQuickMenu = (userId: string, menuId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MGMT}/${userId}/quick-menus/${menuId}`,
    method: Method.DELETE,
  });
};
