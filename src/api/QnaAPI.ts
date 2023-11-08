import BaseURL from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageInfo } from '@/models/components/Page';
import { callApi, Method } from '@utils/ApiUtil';

export const getQnaList = (searchKey: string, searchValue: string, page: PageInfo) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.QNA}`,
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

export const getQnaById = (qnaId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.QNA}/${qnaId}`,
    method: Method.GET,
  });
};

export const createQna = (createdQna: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.QNA}`,
    method: Method.POST,
    params: {
      bodyParams: createdQna,
    },
  });
};

export const updateQna = (qnaId: string, updatedQna: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.QNA}/${qnaId}`,
    method: Method.PUT,
    params: {
      bodyParams: updatedQna,
    },
  });
};

export const deleteQna = (qnaId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.QNA}/${qnaId}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        qnaId,
      },
    },
  });
};
