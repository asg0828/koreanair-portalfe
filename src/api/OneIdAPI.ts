import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageInfo } from '@/models/components/Page';
import {
  ConversionSearch,
  ctiVocSearch,
  dailySearch,
  errorSearch,
  mobileMasterSearch,
  mobileSearch,
  oneidHistorySearch,
  paxMappingSearch,
  relationSearch,
} from '@/models/oneId/OneIdInfo';
import { callApi, Method } from '@utils/ApiUtil';

// oneid 마스터
export const getMasterHistory = (searchInfo: oneidHistorySearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// oneid 히스토리
export const getHistory = (searchInfo: oneidHistorySearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// oneid 팩스 매핑
export const getPaxMapping = (searchInfo: paxMappingSearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// 대리점 추정번호 마스터
export const getMobileMaster = (searchInfo: mobileMasterSearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// 대리점 추정번호
export const getMobile = (searchInfo: mobileSearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// 관계이력
export const getRelation = (searchInfo: relationSearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// 에러이력
export const getErrorLog = (searchInfo: errorSearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// 데일리 리포트
export const getDaily = (searchInfo: dailySearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// CTI/VOC 리포트
export const getCtiVoc = (searchInfo: ctiVocSearch, page: PageInfo) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// samePnrUciid
export const getSamePnr = (page: PageInfo) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    },
  });
};

// 데이버 변화
export const getConversion = (searchInfo: ConversionSearch, page: PageInfo) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: { ...searchInfo, page: page.page + 1, pageSize: page.pageSize },
    },
  });
};
