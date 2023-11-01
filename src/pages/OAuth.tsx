import React, { ReactElement, useEffect } from 'react';
import CommonResponse from '@models/common/CommonResponse';
import { SessionRequest, AccessTokenRefreshTokenRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import SessionApis from '@api/common/SessionApis';
import { Stack, Loader } from '@components/ui';

const OAuth: React.FC = (): ReactElement => {
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();
  const location = window.location;
  const accessTokenRefreshTokenInfo = sessionUtil.getAccessTokenRefreshTokenInfo;

  const searchParameters = new URLSearchParams(location.search);
  const refreshToken = accessTokenRefreshTokenInfo().refreshToken;
  const authorizationCode: any = searchParameters.get('code');

  const accessPathname = localStorage.getItem('accessPathname');

  if (!accessPathname) {
    localStorage.setItem('accessPathname', location.pathname);
  }

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

        sessionStorage.setItem('googleAccessToken', sessionRequest.googleAccessToken);
        sessionStorage.setItem('googleIdToken', sessionRequest.googleIdToken);

        let href: string = '/';
        if (accessPathname) {
          href = accessPathname;
          localStorage.removeItem('accessPathname');
        }
        window.location.href = href;
      })();
    }
  });

  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  );
};

export default OAuth;
