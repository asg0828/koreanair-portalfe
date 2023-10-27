import { callApi, Method } from '@utils/ApiUtil';
import { callAuthenticationApi, OAuthMethod } from '@utils/OAuthApiUtil';
import { Service } from '@models/common/Service';
import SessionUtil from '@utils/SessionUtil';
import { LoginRequest, AccessTokenRefreshTokenRequest, AccessTokenRefreshTokenInfo } from '@models/common/Session';
import CommonResponse from '@/models/common/CommonResponse';
import jwtDecode from 'jwt-decode';

export default class SessionApis {
  public login = async (loginReqeust: LoginRequest, isLoading = true) => {
    return callApi({
      service: Service.KAL_BE,
      url: '/api/v1/session',
      method: Method.GET,
      params: {
        bodyParams: loginReqeust,
      },
      config: {
        isLoarding: isLoading,
      },
    });
  };

  // public oauthLogin = async () => {
  public oauthLogin() {
    const apiUrl = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL) : {};
    const baseURL: string = apiUrl['APIGEE_BE'] || '';
    const redirectUri: string = encodeURIComponent(process.env.REACT_APP_AUTHORIZATION_REDIRECT_URL || '');
    const clientId = process.env.REACT_APP_CLIENT_ID || '';

    const googleOAuthUrl = baseURL + `/oauth2/v1/auth?redirect_uri=${redirectUri}&client_id=${clientId}`;

    fetch(googleOAuthUrl, {
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        if (response.type === 'opaqueredirect') {
          new SessionUtil().deleteSessionInfo();
          window.location.href = response.url;
        }
      })
      .catch(function (err) {
        // console.error('when redirected error is occurred. The error message is ' , err.message);
      });
    // return;
  }
  public accessTokenRefreshTokenRequset = async (
    accessTokenRefreshTokenReqeust: AccessTokenRefreshTokenRequest,
    isLoading = true,
    isAccessTokenRefreshToken = true
  ) => {
    const redirectUri: string = process.env.REACT_APP_AUTHORIZATION_REDIRECT_URL || '';
    const authorizationGrantType: string = process.env.REACT_APP_AUTHORIZATION_GRANT_TYPE || '';
    const accessTokenRefreshTokenParameter =
      `code=${accessTokenRefreshTokenReqeust.code}&grant_type=${authorizationGrantType}&redirect_uri=` +
      encodeURIComponent(`${redirectUri}`);
    const sessionUtil = new SessionUtil();

    let accessTokenRefreshTokenResponse: CommonResponse = {
      successOrNot: 'N',
      statusCode: 'N', // StatusCode.UNKNOWN_ERROR,
      data: {},
    };

    accessTokenRefreshTokenResponse = await callAuthenticationApi({
      service: Service.APIGEE_AUTH,
      url: '/oauth2/v1/token',
      method: OAuthMethod.POST,
      params: {
        //  queryParams: {...accessTokenRefreshTokenReqeust},
        bodyParams: accessTokenRefreshTokenParameter,
      },
      config: {
        isLoarding: isLoading,
        isAccessTokenRefreshToken: isAccessTokenRefreshToken,
      },
    });

    const accessTokenRefreshTokenJson = JSON.parse(accessTokenRefreshTokenResponse.data as string);
    // eslint-disable-next-line
    const { given_name }: any = jwtDecode(accessTokenRefreshTokenJson.data.google_id_token);

    const accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo = {
      accessToken: accessTokenRefreshTokenJson.data.access_token,
      refreshToken: accessTokenRefreshTokenJson.data.refresh_token,
      clientName: given_name,
    };
    sessionUtil.deleteSessionInfo();
    sessionUtil.setAccessTokenRefreshTokenInfo(accessTokenRefreshTokenInfo);
    return accessTokenRefreshTokenResponse;
  };

  public accessTokenRequset = async (isLoading = true, isAccessToken = true) => {
    const sessionUtil = new SessionUtil();
    const accessTokenParameter = `grant_type=refresh_token&refresh_token=${
      sessionUtil.getAccessTokenRefreshTokenInfo().refreshToken?.toString() || ''
    }`;
    let newAccessTokenResponse: CommonResponse = {
      successOrNot: 'N',
      statusCode: 'N', // StatusCode.UNKNOWN_ERROR,
      data: {},
    };

    newAccessTokenResponse = await callAuthenticationApi({
      service: Service.APIGEE_AUTH,
      url: '/oauth2/v1/token',
      method: OAuthMethod.POST,
      params: {
        bodyParams: accessTokenParameter || '',
      },
      config: {
        isLoarding: isLoading,
        isAccessToken: isAccessToken,
      },
    });
    sessionUtil.setAccessToken(JSON.parse(newAccessTokenResponse.data as string).data.access_token as string);
    return newAccessTokenResponse;
  };

  public logoutRequset = async (isLoading = true, isLogout = true) => {
    const sessionUtil = new SessionUtil();
    const logoutParameter = `client_id=${process.env.REACT_APP_CLIENT_ID || ''}&grant_type=revoke_token`;
    let logoutResponse: CommonResponse = {
      successOrNot: 'N',
      statusCode: 'N', // StatusCode.UNKNOWN_ERROR,
      data: {},
    };

    logoutResponse = await callAuthenticationApi({
      service: Service.APIGEE_AUTH,
      url: '/oauth2/v1/revoketoken',
      method: OAuthMethod.POST,
      params: {
        //  queryParams: {...accessTokenRefreshTokenReqeust},
        bodyParams: logoutParameter,
      },
      config: {
        isLoarding: isLoading,
        isLogout: isLogout,
      },
    });

    sessionUtil.deleteSessionInfo();

    return logoutResponse;
  };

  public logout = async (isLoading = true) => {
    return callApi({
      service: Service.KAL_BE,
      url: '/api/v1/session',
      method: Method.DELETE,
      config: {
        isLoarding: isLoading,
      },
    });
  };
}