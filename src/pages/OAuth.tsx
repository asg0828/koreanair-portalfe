import React, { ReactElement, useEffect } from 'react';
import CommonResponse from '@models/common/CommonResponse';
import { SessionRequest, AccessTokenRefreshTokenRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import SessionApis from '@api/common/SessionApis';

const OAuth: React.FC = (): ReactElement => {
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();
  const location = window.location;
  const accessTokenRefreshTokenInfo = sessionUtil.getAccessTokenRefreshTokenInfo;

  const searchParameters = new URLSearchParams(location.search);
  const refreshToken = accessTokenRefreshTokenInfo().refreshToken;
  const authorizationCode: any = searchParameters.get('code');

  useEffect(() => {
    if (!refreshToken && !authorizationCode) {
      sessionApis.oauthLogin();
    } else if (!refreshToken && searchParameters) {
      const accessTokenRefreshTokenRequest: AccessTokenRefreshTokenRequest = {
        code: authorizationCode || '',
      };
      (async () => {
        const response: CommonResponse = await sessionApis.accessTokenRefreshTokenRequset(
          accessTokenRefreshTokenRequest
        );

        const data = JSON.parse(response.data);

        const sessionRequest: SessionRequest = {
          googleAccessToken: data.data.google_access_token,
          googleIdToken: data.data.google_id_token,
        };

        window.location.href = '/';
      })();
    }
  });

  return <></>;
};

export default OAuth;
