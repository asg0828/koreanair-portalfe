import BaseURL from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

export const getCodeGroupAllList = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.CODE}/all`,
    method: Method.GET,
  });
};

export const getCodeList = (groupId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.CODE}/${groupId}/codes`,
    method: Method.GET,
  });
};

export const getCodeGroupById = (groupId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.CODE}/${groupId}`,
    method: Method.GET,
  });
};

export const getCodeById = (groupId: string, codeId: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.CODE}/${groupId}/codes/${codeId}`,
    method: Method.GET,
  });
};

export const createCodeGroup = (createdCodeGroup: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.CODE}`,
    method: Method.POST,
    params: {
      bodyParams: createdCodeGroup,
    },
  });
};

export const createCode = (groupdId: string, createdCode: object) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${BaseURL.CODE}/${groupdId}/codes`,
    method: Method.POST,
    params: {
      bodyParams: createdCode,
    },
  });
};
