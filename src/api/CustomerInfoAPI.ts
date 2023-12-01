import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

// CDP-360
export const getCustomerInfo = (searchInfo: any) => {
  console.log(searchInfo);
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
