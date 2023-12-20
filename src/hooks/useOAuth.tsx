import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath } from '@/models/common/Constants';
import { selectContextPath } from '@/reducers/authSlice';
import SessionApis from '@api/common/SessionApis';
import CommonResponse, { StatusCode } from '@models/common/CommonResponse';
import { AccessTokenRefreshTokenRequest, SessionRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import { useCallback, useEffect, useState } from 'react';

const useOAuth = (sessionUtil: SessionUtil, sessionApis: SessionApis) => {
  const contextPath = useAppSelector(selectContextPath());
  const refreshToken = sessionUtil.getAccessTokenRefreshTokenInfo().refreshToken;
  const searchParameters = new URLSearchParams(window.location.search);
  const authorizationCode: any = searchParameters.get('code');
  const [sessionRequestInfo, setSessionRequestInfo] = useState<SessionRequest>(sessionUtil.getSessionRequestInfo());
  const [isError, setIsError] = useState<boolean>(false);

  const getAccessTokenInfo = useCallback(() => {
    const accessTokenRefreshTokenRequest: AccessTokenRefreshTokenRequest = {
      code: authorizationCode || '',
    };

    (async () => {
      const response: CommonResponse = await sessionApis.accessTokenRefreshTokenRequset(accessTokenRefreshTokenRequest);

      if (response.successOrNot === 'Y' && response.statusCode === StatusCode.SUCCESS) {
        const data = JSON.parse(response.data);

        const sessionRequest: SessionRequest = {
          googleAccessToken: data.data.google_access_token,
          googleIdToken: data.data.google_id_token,
        };

        sessionUtil.setSessionRequestInfo(sessionRequest);
        setSessionRequestInfo(sessionRequest);
      } else {
        setIsError(true);
      }
    })();
  }, [sessionApis, sessionUtil, authorizationCode]);

  useEffect(() => {
    if (contextPath !== ContextPath.UNAUTHORIZED) {
      if (!refreshToken && !isError) {
        if (authorizationCode) {
          getAccessTokenInfo();
        } else {
          sessionApis.oauthLogin();
        }
      }
    }
  }, [contextPath, authorizationCode]);

  return { sessionRequestInfo, isError };
};

export default useOAuth;
