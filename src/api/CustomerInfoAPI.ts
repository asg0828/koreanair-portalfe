import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

// CDP-360
export const getCustomerInfo = (searchInfo: any) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
      },
    },
  });
};

// Oneid로 Profile 조회
export const getProfileOneId = (oneId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID_PROFILE}/${oneId}`,
    method: Method.GET,
  });
};

// skypassNo로 Profile 조회
export const getProfileSkypassNo = (skypassNo: number) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.SKYPASS_PROFILE}/${skypassNo}`,
    method: Method.GET,
  });
};

// 모바일 번호로 맴버 조회(C-Level)
export const getMobile = (mobile: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.MOBILE}`,
    method: Method.GET,
    params: {
      queryParams: { mobile },
    },
  });
};

// 한글명으로 맴버 조회(C-Level)
export const getKorname = (first: string, last: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.KORNAME}`,
    method: Method.GET,
    params: {
      queryParams: { first, last },
    },
  });
};

// 영문명으로 맴버 조회(C-Level)
export const getEngname = (first: string, last: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ENGNAME}`,
    method: Method.GET,
    params: {
      queryParams: { first, last },
    },
  });
};

export const getTelephoneHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};
export const getVocHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};
export const getSmsHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};
export const getInternetHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};
export const getEmailHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};

export const getSnsHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};

export const getPnrHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};

export const getEtktHis = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};

export const getBoardingCnt = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};

export const getPetCnt = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {},
  });
};
