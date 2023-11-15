import '@/assets/styles/global.scss';
import Fallback from '@/components/fallback/Fallback';
import ModalContainer from '@/components/modal/ModalContainter';
import useAuth from '@/hooks/useAuth';
import useMenu from '@/hooks/useMenu';
import useOAuth from '@/hooks/useOAuth';
import { useAppDispatch } from '@/hooks/useRedux';
import useRouter from '@/hooks/useRouter';
import { ContextPath, ValidType } from '@/models/common/Constants';
import { setContextPath } from '@/reducers/authSlice';
import { setBaseApiUrl } from '@/utils/ApiUtil';
import SessionApis from '@api/common/SessionApis';
import { Toaster, useToast } from '@components/ui';
import Watermark from '@uiw/react-watermark';
import SessionUtil from '@utils/SessionUtil';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

const App = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();
  const pathname = window.location.pathname;
  if (pathname.startsWith(ContextPath.ADMIN)) {
    dispatch(setContextPath(ContextPath.ADMIN));
    setBaseApiUrl('/bo');
  } else if (pathname.startsWith(ContextPath.POPUP)) {
    dispatch(setContextPath(ContextPath.POPUP));
    transferLocalStorage();
  } else if (pathname.startsWith(ContextPath.ADMIN_POPUP)) {
    dispatch(setContextPath(ContextPath.ADMIN_POPUP));
    setBaseApiUrl('/bo');
    transferLocalStorage();
  } else if (pathname.startsWith(ContextPath.TEST)) {
    dispatch(setContextPath(ContextPath.TEST));
    setBaseApiUrl('/bo');
  }

  const { sessionRequestInfo, isError: oIsError } = useOAuth(sessionUtil, sessionApis);
  const { sessionInfo, isError } = useAuth(sessionUtil, sessionApis, sessionRequestInfo);
  const [routerList] = useMenu(sessionRequestInfo, sessionInfo);
  const [router] = useRouter(routerList);

  function transferLocalStorage() {
    const localTokenInfo = sessionUtil.getLocalAccessTokenRefreshTokenInfo();
    const localSessionRequestInfo = sessionUtil.getLocalSessionRequestInfo();
    const localSessionInfo = sessionUtil.getLocalSessionInfo();

    if (localTokenInfo.refreshToken) {
      sessionUtil.setAccessTokenRefreshTokenInfo(localTokenInfo);
      sessionUtil.setSessionRequestInfo(localSessionRequestInfo);
      sessionUtil.setSessionInfo(localSessionInfo);
    }

    sessionUtil.deleteLocalStorage();
  }

  useEffect(() => {
    if (oIsError) {
      toast({
        type: ValidType.ERROR,
        content: 'Google SSO 인증 중 에러가 발생했습니다.',
      });
    } else if (isError) {
      toast({
        type: ValidType.ERROR,
        content: '로그인 중 에러가 발생했습니다.',
      });
    }
  }, [oIsError, isError, toast]);

  return (
    <Suspense fallback={<Fallback />}>
      {sessionRequestInfo.googleAccessToken && sessionInfo.sessionId && router ? (
        <Watermark content={sessionInfo.email} className="width-100 height-100">
          <RouterProvider router={router} />
        </Watermark>
      ) : (
        <Fallback />
      )}

      <ModalContainer />
      <Toaster />
    </Suspense>
  );
};
export default App;
