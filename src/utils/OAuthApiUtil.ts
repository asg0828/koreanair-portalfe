import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import SessionUtil from './SessionUtil';

import CommonResponse, { StatusCode } from '@models/common/CommonResponse';
import { Buffer } from 'buffer';
import { Service, ServicePort } from '@models/common/Service';
import SessionApis from '@/api/common/SessionApis';

export enum OAuthMethod {
  GET = 'GET',
  POST = 'POST',
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
  isAccessToken?: boolean;
  isLogout?: boolean;
}

export interface OAuthApiRequest {
  service: Service;
  url: string;
  method: OAuthMethod;
  params?: ParamString;
  config?: Config;
}

/* istanbul ignore next */
const getInstance = (
  serviceName: string,
  isLoading: boolean,
  params?: any,
  isOAuth?: boolean,
  isAccessTokenRefreshToken?: boolean,
  isAccessToken?: boolean,
  isLogout?: boolean
): AxiosInstance => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;
  // axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  const apiUrl = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL) : {};

  let baseURL: string = apiUrl['APIGEE_BE'] || '';
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();

  // const authHeader = btoa(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET);
  const authenticationHeader = Buffer.from(
    String(process.env.REACT_APP_CLIENT_ID) + ':' + String(process.env.REACT_APP_CLIENT_ID)
  ).toString('base64');
  const accessToken = sessionUtil.getAccessToken();
  if (process.env.REACT_APP_NODE_ENV === 'local') {
    switch (serviceName) {
      case Service.KAL_BE:
        baseURL += ':' + ServicePort.KAL_BE.toString();
        break;
      case Service.APIGEE_AUTH:
        break;
      default:
        break;
    }
  }

  const instance = axios.create({
    baseURL: baseURL,
    params: params || {},
    // maxRedirects: 0,
  });

  // 공통 요청 처리
  instance.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (config?.headers) {
        if (isOAuth) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (isAccessTokenRefreshToken) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.headers['authorization'] = 'Basic ' + authenticationHeader;
        }
        if (isAccessToken) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.headers['authorization'] = 'Basic ' + authenticationHeader;
        }
        if (isLogout) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.headers['authorization'] = 'Bearer ' + accessToken;
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
      const commonResponse: CommonResponse = {
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: JSON.stringify(response),
        header: response?.headers,
      };
      return commonResponse;
    },

    (error: any): any => {
      const unknownError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.UNKNOWN_ERROR,
        data: {},
      };

      if (error.response && error.response.status.toString().indexOf('40') === 0) {
        if (error.response.status.toString() === '403' && error.response.data.errorCode.toString() === '302') {
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

export const callAuthenticationApi = async (oauthApiRequest: OAuthApiRequest): Promise<CommonResponse> => {
  const url: string = oauthApiRequest.url + getQueryStringFormat(oauthApiRequest.params?.queryParams);
  const isLoading = oauthApiRequest.config?.isLoarding || false;
  const isOAuth = oauthApiRequest.config?.isOAuth || false;

  const isAccessTokenRefreshToken = oauthApiRequest.config?.isAccessTokenRefreshToken || false;
  const isAccessToken = oauthApiRequest.config?.isAccessToken || false;
  const isLogout = oauthApiRequest.config?.isLogout || false;

  switch (oauthApiRequest.method) {
    case OAuthMethod.GET:
      return await getInstance(oauthApiRequest.service, isLoading, {}, isOAuth, isAccessTokenRefreshToken).get(url);
    case OAuthMethod.POST:
      return await getInstance(
        oauthApiRequest.service,
        isLoading,
        {},
        isOAuth,
        isAccessTokenRefreshToken,
        isAccessToken,
        isLogout
      ).post(url, oauthApiRequest.params?.bodyParams);
    default:
      throw Error('Not Supported Method');
  }
};
