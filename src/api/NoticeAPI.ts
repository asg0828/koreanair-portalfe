import BaseURL from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageInfo } from '@/models/components/Page';
import { callApi, Method } from '@utils/ApiUtil';

export const getNoticeList = (searchKey: string, searchValue: string, page: PageInfo) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.NOTICE}`,
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
    url: `${BaseURL.NOTICE}/${noticeId}`,
    method: Method.GET,
  });
};

export const createNotice = (createdNotice: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.NOTICE}`,
    method: Method.POST,
    params: {
      bodyParams: createdNotice,
    },
  });
};

export const updateNotice = (noticeId: string, updatedNotice: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.NOTICE}/${noticeId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedNotice,
    },
  });
};

export const deleteNotice = (noticeId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.NOTICE}/${noticeId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        noticeId,
      },
    },
  });
};
