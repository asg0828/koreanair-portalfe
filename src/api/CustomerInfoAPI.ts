import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

// Oneid로 Profile 조회
export const getProfile = (searchInfo: any) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/profile`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
      },
    },
  });
};

// 영문명으로 맴버 조회(C-Level)
export const getProfileCLevel = (searchInfo: any) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/members`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
      },
    },
  });
};

// 스카이패스 조회
export const getSkypass = (skypassMemberNumber : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/skypass`,
    method: Method.GET,
    params: {
      queryParams: {
        skypassMemberNumber
      },
    },
  });
};

// Communication Records TMS 정보 조회
export const getTmsHis = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/communication-tms`,
    method: Method.GET,
    params: {
      queryParams: {
        oneidNo 
      },
    },
  });
};

// Communication Records VOC 정보 조회
export const getVocHis = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/communication-voc`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };

// Communication Records 상담 정보 조회
export const getCosHis = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/communication-cust-service`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };

// Communication Records 캠페인 정보 조회
export const getCampHis = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}/communication-campaign`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };


export const getPnrHis = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };

export const getEtktHis = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };

export const getBoardingCnt = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };

export const getPetCnt = (oneidNo : string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.CUSTOMER}`,
    method: Method.GET,
    params: {
          queryParams: {
            oneidNo 
          },
        },
      });
    };
