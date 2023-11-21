import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { NoticeParams } from '@/models/model/NoticeModel';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getNoticeList = (params: NoticeParams, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.NOTICE}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...params,
        ...page,
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
