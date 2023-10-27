import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import SessionUtil from '@utils/SessionUtil';
import SessionApis from '@api/common/SessionApis';
import CommonResponse, { StatusCode } from '@models/common/CommonResponse';

import { v4 as uuidv4 } from 'uuid';
import { Service, ServicePort } from '@models/common/Service';

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

/* istanbul ignore next */
const getInstance = (serviceName: string, isLoading: boolean, params?: any, isFile?: boolean): AxiosInstance => {
  if (isLoading) {
    // @ts-ignore
    // eslint-disable-next-line
    window.loadingSpinner.setAdd();
  }

  axios.defaults.headers.get['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.headers.patch['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;
  const apiUrl = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL) : {};

  let baseURL: string = apiUrl['KAL_BE'] || '';
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();

  if (process.env.REACT_APP_NODE_ENV === 'local') {
    switch (serviceName) {
      case Service.KAL_BE:
        baseURL += ':' + ServicePort.KAL_BE.toString();
        break;
      default:
        break;
    }
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
          config['responseType'] = 'blob';
          config.headers['accept'] = 'application/octet-stream';
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
      const commonResponse: CommonResponse = response.data as CommonResponse;
      commonResponse.header = response?.headers;
      if (isLoading) {
        // @ts-ignore
        // eslint-disable-next-line
        window.loadingSpinner.setMinus();
      }

      return commonResponse;
    },

    (error: any): any => {
      if (isLoading) {
        // @ts-ignore
        // eslint-disable-next-line
        window.loadingSpinner.setMinus();
      }

      const unknownError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.UNKNOWN_ERROR,
        data: {},
      };
      // eslint-disable-next-line
      if (error.response && error.response.status.toString().indexOf('40') === 0) {
        // eslint-disable-next-line
        if (error.response.status.toString() === '403' && error.response.data.errorCode.toString() === '301') {
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
          sessionApis.oauthLogin();
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

export const callApi = async (apiRequest: ApiRequest): Promise<CommonResponse> => {
  const url: string = apiRequest.url + getQueryStringFormat(apiRequest.params?.queryParams);
  const isLoading = apiRequest.config?.isLoarding || false;
  const isFile = apiRequest.config?.isFile || false;
  let response: CommonResponse = {
    successOrNot: 'N',
    statusCode: StatusCode.UNKNOWN_ERROR,
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
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).delete(url);
      break;
    default:
      break;
  }
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
