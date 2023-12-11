import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { DeletedDeptModel, UpdatedDeptModel } from '@/models/model/DeptModel';
import { Method, callApi } from '@utils/ApiUtil';

export const getDeptAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}`,
    method: Method.GET,
  });
};

export const updateDept = (updatedDeptList: Array<UpdatedDeptModel | DeletedDeptModel>) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: updatedDeptList,
    },
  });
};
