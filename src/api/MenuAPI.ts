import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { DeletedMenuModel, UpdatedMenuModel } from '@/models/model/MenuModel';
import { Method, callApi } from '@utils/ApiUtil';

export const getUserMenuList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MENU_MGMT}`,
    method: Method.GET,
  });
};

export const updateUserMenu = (updatedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MENU_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: updatedMenuList,
    },
  });
};

export const getAdminMenuList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_MENU_MGMT}`,
    method: Method.GET,
  });
};

export const updateAdminMenu = (updatedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_MENU_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: updatedMenuList,
    },
  });
};

export const getUserAuthMenuList = (authId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MENU}/${authId}`,
    method: Method.GET,
  });
};

export const createUserAuthMenu = (authId: string, menuIds: Array<string>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_AUTH_MENU}/${authId}`,
    method: Method.POST,
    params: {
      queryParams: {
        menuIds: menuIds.join(),
      },
    },
  });
};

export const getAdminAuthMenuList = (authId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MENU}/${authId}`,
    method: Method.GET,
  });
};

export const createAdminAuthMenu = (authId: string, menuIds: Array<string>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_AUTH_MENU}/${authId}`,
    method: Method.POST,
    params: {
      queryParams: {
        menuIds: menuIds.join(),
      },
    },
  });
};
