import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getNoticeList = (searchKey: string, searchValue: string, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.NOTICE}`,
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

export const getNoticeById = (noticeId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.NOTICE}/${noticeId}`,
    method: Method.GET,
  });
};

export const createNotice = (createdNotice: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.NOTICE}`,
    method: Method.POST,
    params: {
      bodyParams: createdNotice,
    },
  });
};

export const updateNotice = (noticeId: string, updatedNotice: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.NOTICE}/${noticeId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedNotice,
    },
  });
};

export const deleteNotice = (noticeId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.NOTICE}/${noticeId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        noticeId,
      },
    },
  });
};
