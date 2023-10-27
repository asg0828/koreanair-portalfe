import React, { ReactElement } from 'react';
import CommonResponse from '@models/common/CommonResponse';
import { AccessTokenRefreshTokenRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import SessionApis from '@api/common/SessionApis';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Typography, Button } from '@components/ui';

const TestAuth: React.FC = (): ReactElement => {
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();
  const location = useLocation();
  const navigate = useNavigate();
  const accessTokenRefreshTokenInfo = sessionUtil.getAccessTokenRefreshTokenInfo;

  const searchParameters = new URLSearchParams(location.search);
  const refreshToken = accessTokenRefreshTokenInfo().refreshToken;
  const authorizationCode: any = searchParameters.get('code');

  const handleAuth = () => {
    if (!refreshToken && !authorizationCode) {
      // (async () => {
      sessionApis.oauthLogin();
      // })();
    } else if (!refreshToken && searchParameters) {
      const accessTokenRefreshTokenRequest: AccessTokenRefreshTokenRequest = {
        code: authorizationCode || '',
      };
      (async () => {
        const response: CommonResponse = await sessionApis.accessTokenRefreshTokenRequset(
          accessTokenRefreshTokenRequest
        );
        navigate('/landingpage');
      })();
    }
  };

  return (
    <div id="loginForm">
      <Stack>
        <Typography>Google Login</Typography>
        <Button onClick={handleAuth}>인증 요청</Button>
      </Stack>
    </div>
  );
};

export default TestAuth;
