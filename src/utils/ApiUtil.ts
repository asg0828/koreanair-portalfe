import SessionApis from '@api/common/SessionApis';
import CommonResponse, { StatusCode } from '@models/common/CommonResponse';
import SessionUtil from '@utils/SessionUtil';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { PortalApiURL } from '@/models/common/ApiURL';
import { Service, ServiceContextPath } from '@models/common/Service';
import { v4 as uuidv4 } from 'uuid';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface QueryParams {
  [key: string]: string | number | boolean;
}

export interface ParamObject {
  queryParams?: QueryParams;
  bodyParams?: object;
}

export interface ParamString {
  queryParams?: QueryParams;
  bodyParams?: string;
}

export interface Config {
  isLoarding?: boolean;
  isFile?: boolean;
  isOAuth?: boolean;
  isAccessTokenRefreshToken?: boolean;
}

export interface ApiRequest {
  service: Service;
  url: string;
  method: Method;
  params?: ParamObject;
  config?: Config;
  redirect?: string;
}

let baseApiUrl: BaseApiUrl = '/fo';

export type BaseApiUrl = '/fo' | '/bo';

export const getBaseApiUrl = () => {
  return baseApiUrl;
};

export const setBaseApiUrl = (changedUrl: BaseApiUrl) => {
  baseApiUrl = changedUrl;
};

export const getFileDownloadPath = () => {
  const apiUrl = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL) : {};
  return `${apiUrl['KAL_BE']}${ServiceContextPath.KAL_BE + baseApiUrl + PortalApiURL.FILE}/download`;
};

/* istanbul ignore next */
const getInstance = (serviceName: string, isLoading: boolean, params?: any, isFile?: boolean): AxiosInstance => {
  axios.defaults.headers.get['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.headers.patch['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;
  const apiUrl = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL) : {};

  let baseURL: string = apiUrl['KAL_BE'] || '';
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();

  switch (serviceName) {
    case Service.KAL_BE:
      baseURL = baseURL + ServiceContextPath.KAL_BE + baseApiUrl;
      break;
    // 2023-11-02 김태훈A Self-Feature BE API case 추가
    case Service.KAL_SF_BE:
      baseURL = `${apiUrl['KAL_SF_BE']}`; //:${ServicePort.KAL_SF_BE.toString()}`;
      break;
    default:
      break;
  }

  const instance = axios.create({
    baseURL: baseURL,
    params: params || {},
  });

  // 공통 요청 처리
  instance.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (config?.headers) {
        const accessToken: string | undefined = sessionUtil.getAccessTokenRefreshTokenInfo().accessToken;

        if (accessToken) config.headers['authorization'] = `Bearer ${accessToken}`;

        if (sessionUtil.getSessionInfo().sessionId) {
          config.headers['x-session-id'] = sessionUtil.getSessionInfo().sessionId || '';
        }
        if (isFile) {
          if (config.method === 'get') {
            config['responseType'] = 'blob';
          } else if (config.method === 'post') {
            config.headers['Content-Type'] = 'multipart/form-data';
          }
        } else {
          config.headers['x-correlation-id'] =
            window.location.pathname === '/'
              ? 'root'.concat('_').concat(uuidv4())
              : window.location.pathname?.concat('_').concat(uuidv4()) || '';
          config.headers['Content-Type'] = 'application/json';
        }
      }
      return config;
    },
    (error: any): Promise<any> => {
      return Promise.reject(error);
    }
  );

  // success / error 공통 처리
  instance.interceptors.response.use(
    (response: any): any => {
      let commonResponse: CommonResponse;
      if (isFile && response.config.method === 'get') {
        commonResponse = response;
      } else {
        commonResponse = response.data;
      }
      commonResponse.header = response?.headers;
      commonResponse.status = response?.status;
      commonResponse.statusCode = StatusCode.SUCCESS;
      commonResponse.successOrNot = 'Y';

      return commonResponse;
    },

    (error: any): any => {
      const unknownError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.UNKNOWN_ERROR,
        data: {},
        status: error?.response?.status,
        message: error?.response?.data.message,
      };
      // eslint-disable-next-line
      if (error.response && error.response.status.toString().indexOf('40') === 0) {
        const errorCode = error?.response?.data?.errorCode?.toString();

        if (errorCode) {
          if (errorCode === '301') {
            return sessionApis.accessTokenRequest().then((newAccessTokenResponse) => {
              const originalRequest = error.config;
              originalRequest.headers['authorization'] = `Bearer ${
                JSON.parse(newAccessTokenResponse.data as string).data.access_token as string
              }`;
              return axios.request(originalRequest as AxiosRequestConfig).then((retryResponse) => {
                return retryResponse.data as CommonResponse;
              });
            });
          } else {
            sessionUtil.deleteSessionInfo();
            window.location.reload();
          }
        } else if (error.response.status.toString() === '401') {
          //INVALID_GOOGLE_ID_TOKEN
          if (error.response.data.message === 'INVALID_GOOGLE_ID_TOKEN') {
            sessionUtil.deleteSessionInfo();
            window.location.reload();
          }
        } else if (error.response.status.toString() === '403') {
          // 포탈 세션 만료
          if (error.response.data.message === 'SESSION_EXPIRE') {
            sessionStorage.removeItem('sessionId');
            window.location.reload();
          }
        }
      }

      return unknownError;
    }
  );

  return instance;
};

const getQueryStringFormat = (queryParams?: QueryParams) => {
  if (!queryParams) return '';
  const keys = Object.keys(queryParams);
  const queryString = keys
    .filter((key) => !!queryParams[key])
    .map((key) => `${key}=${encodeURIComponent(queryParams[key] as string)}`) // eslint-disable-line
    .join('&');
  return queryString ? `?${queryString}` : '';
};

type ConvertPageType = 'request' | 'response';

const convertPage = (type: ConvertPageType, data?: any) => {
  if (data?.page) {
    if (type === 'request') {
      data.page = data.page + 1;
    } else {
      data.page = data.page - 1;
    }
  }
};

export const callApi = async (apiRequest: ApiRequest): Promise<CommonResponse> => {
  convertPage('request', apiRequest.params?.queryParams);

  const url: string = apiRequest.url + getQueryStringFormat(apiRequest.params?.queryParams);
  const isLoading = apiRequest.config?.isLoarding || false;
  const isFile = apiRequest.config?.isFile || false;
  let response: CommonResponse = {
    successOrNot: 'N',
    statusCode: StatusCode.UNKNOWN_ERROR,
    result: {},
    data: {},
  };

  switch (apiRequest.method) {
    case Method.GET:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).get(url);
      break;
    case Method.POST:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).post(url, apiRequest.params?.bodyParams);
      break;
    case Method.PUT:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).put(url, apiRequest.params?.bodyParams);
      break;
    case Method.PATCH:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).patch(url, apiRequest.params?.bodyParams);
      break;
    case Method.DELETE:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).delete(url, {
        data: apiRequest.params?.bodyParams,
      });
      break;
    default:
      break;
  }

  convertPage('response', response?.data?.page);
  return response;
};

export const callApiForFile = async (apiRequest: ApiRequest): Promise<any> => {
  const url: string = apiRequest.url + getQueryStringFormat(apiRequest.params?.queryParams);
  const isLoading = apiRequest.config?.isLoarding || false;
  const isFile = apiRequest.config?.isFile || false;
  let response;

  switch (apiRequest.method) {
    case Method.GET:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).get(url);
      break;
    case Method.POST:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).post(url, apiRequest.params?.bodyParams);
      break;
    case Method.PUT:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).put(url, apiRequest.params?.bodyParams);
      break;
    case Method.PATCH:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).patch(url, apiRequest.params?.bodyParams);
      break;
    case Method.DELETE:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).delete(url);
      break;
    default:
      throw Error('Not Supported Method');
  }
  return response;
};
