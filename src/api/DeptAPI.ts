import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { DeptParams } from '@/models/model/DeptModel';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getDeptAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}`,
    method: Method.GET,
  });
};

export const getDeptList = (params: DeptParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        ...page,
      },
    },
  });
};

export const getDeptById = (deptCode: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}/${deptCode}`,
    method: Method.GET,
  });
};

export const createDept = (createdDept: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}`,
    method: Method.POST,
    params: {
      bodyParams: createdDept,
    },
  });
};

export const updateDept = (deptCode: string, updatedDept: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}/${deptCode}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedDept,
    },
  });
};

export const deleteDept = (deptCode: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DEPT_MGMT}/${deptCode}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        deptCode,
      },
    },
  });
};
