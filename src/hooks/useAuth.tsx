import { useAppDispatch } from '@/hooks/useRedux';
import { login } from '@/reducers/authSlice';
import SessionApis from '@api/common/SessionApis';
import CommonResponse, { StatusCode } from '@models/common/CommonResponse';
import { SessionInfo, SessionRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import { useEffect, useState } from 'react';

const useAuth = (sessionUtil: SessionUtil, sessionApis: SessionApis, sessionRequestInfo?: SessionRequest) => {
  const dispatch = useAppDispatch();
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
          dispatch(login(sessionInfo));
          window.history.pushState({}, '', localStorage.getItem('accessPathname'));
        } else if (sessionResponse.status === 401) {
          sessionUtil.deleteSessionInfo();
          sessionApis.oauthLogin();
        } else {
          setIsError(true);
        }
      })();
    }
  }, [sessionApis, sessionUtil, sessionRequestInfo, sessionInfo, isError, dispatch]);

  return { sessionInfo, isError };
};

export default useAuth;
