import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { DeletedEGroupModel, UpdatedEGroupModel, UpdatedEGroupUserModel } from '@/models/model/GroupModel';
import { Method, callApi } from '@utils/ApiUtil';

export const getUserEGroupAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.EGROUP_MGMT_GROUPS}`,
    method: Method.GET,
  });
};

export const getUserEGroupUserList = (groupCode: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.EGROUP_MGMT_GROUP}/${groupCode}/users`,
    method: Method.GET,
  });
};

export const updateUserEGroup = (
  saveEgroup: Array<UpdatedEGroupModel> | Array<DeletedEGroupModel>,
  egroupUserUpdate?: Array<UpdatedEGroupUserModel>
) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.EGROUP_MGMT_GROUPS}`,
    method: Method.POST,
    params: {
      bodyParams: {
        saveEgroup,
        egroupUserUpdate,
      },
    },
  });
};
