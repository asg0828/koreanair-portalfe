import SessionApis from '@api/common/SessionApis';
import CommonResponse, { StatusCode } from '@models/common/CommonResponse';
import { SessionInfo, SessionRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import { useEffect, useState } from 'react';

const useAuth = (sessionUtil: SessionUtil, sessionApis: SessionApis, sessionRequestInfo?: SessionRequest) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>(sessionUtil.getSessionInfo());
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (sessionRequestInfo?.googleAccessToken && !sessionInfo.sessionId && !isError) {
      (async () => {
        const sessionResponse: CommonResponse = await sessionApis.login(sessionRequestInfo);

        if (sessionResponse.successOrNot === 'Y' && sessionResponse.statusCode === StatusCode.SUCCESS) {
          const sessionInfo: SessionInfo = sessionResponse.data as SessionInfo;
          sessionUtil.setSessionInfo(sessionInfo);
          setSessionInfo(sessionInfo);
          window.history.pushState({}, '', localStorage.getItem('accessPathname'));
        } else {
          setIsError(true);
        }
      })();
    }
  }, [sessionApis, sessionUtil, sessionRequestInfo, sessionInfo, isError]);

  return { sessionInfo, isError };
};

export default useAuth;
