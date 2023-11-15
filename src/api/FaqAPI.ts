import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getFaqList = (searchKey: string, searchValue: string, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FAQ}`,
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

export const getFaqById = (faqId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FAQ}/${faqId}`,
    method: Method.GET,
  });
};

export const createFaq = (createdFaq: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FAQ}`,
    method: Method.POST,
    params: {
      bodyParams: createdFaq,
    },
  });
};

export const updateFaq = (faqId: string, updatedFaq: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FAQ}/${faqId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedFaq,
    },
  });
};

export const deleteFaq = (faqId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FAQ}/${faqId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        faqId,
      },
    },
  });
};
