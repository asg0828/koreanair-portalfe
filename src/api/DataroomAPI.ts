import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getDataroomList = (searchKey: string, searchValue: string, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATAROOM}`,
    method: Method.GET,
    params: {
      queryParams: {
        searchConditions: searchKey,
        searchTable: searchValue,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

export const getDataroomById = (dataId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATAROOM}/${dataId}`,
    method: Method.GET,
  });
};

export const createDataroom = (createdDataroom: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATAROOM}`,
    method: Method.POST,
    params: {
      bodyParams: createdDataroom,
    },
  });
};

export const updateDataroom = (dataId: string, updatedDataroom: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATAROOM}/${dataId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedDataroom,
    },
  });
};

export const deleteDataroom = (dataId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.DATAROOM}/${dataId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        dataId,
      },
    },
  });
};
