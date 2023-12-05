import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { DeletedMenuModel, UpdatedMenuModel } from '@/models/model/MenuModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getUserMenuList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MENU_MGMT}`,
    method: Method.GET,
  });
};

export const updateUserMenu = (changedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.USER_MENU_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: changedMenuList,
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

export const updateAdminMenu = (changedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ADMIN_MENU_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: changedMenuList,
    },
  });
};
