import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import {
  ConversionCleansingHashSearch,
  ConversionMetaphoneSearch,
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
export const getMasterHistory = (searchInfo: oneidHistorySearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/master-for-history`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        ...page,
      },
    },
  });
};

// oneid 히스토리
export const getHistory = (searchInfo: oneidHistorySearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/master-history`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        ...page,
      },
    },
  });
};

// oneid 팩스 매핑
export const getPaxMapping = (searchInfo: paxMappingSearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/pax-mapping`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        ...page,
      },
    },
  });
};

// 대리점 추정번호 마스터
export const getMobileMaster = (searchInfo: mobileMasterSearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/master`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        ...page,
      },
    },
  });
};

// 대리점 추정번호
export const getMobile = (searchInfo: mobileSearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/agt-contact`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        ...page,
      },
    },
  });
};

// 관계이력
export const getRelation = (searchInfo: relationSearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/merge-history`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
        ...page,
      },
    },
  });
};

// 에러이력
export const getErrorLog = (searchInfo: errorSearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/error-log`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
        ...searchInfo,
      },
    },
  });
};

// 데일리 리포트
export const getDaily = (searchInfo: dailySearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/daily-report`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
        ...searchInfo,
      },
    },
  });
};

// CTI/VOC 리포트
export const getCtiVoc = (searchInfo: ctiVocSearch, page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/cti-voc-report`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
        ...searchInfo,
      },
    },
  });
};

// samePnrUciid
export const getSamePnr = (page: PageModel) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/same-pnr`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
      },
    },
  });
};

// 데이터 변환 CleansingRule / Hash
export const getConversionCleansingHash = (searchInfo: ConversionCleansingHashSearch) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}/cleansing-hash-results`,
    method: Method.GET,
    params: {
      queryParams: { ...searchInfo },
    },
  });
};

// 데이터 변환 Double Metaphone
export const getConversionMetaphone = (searchInfo: ConversionMetaphoneSearch) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: { ...searchInfo },
    },
  });
};
