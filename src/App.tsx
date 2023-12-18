import '@/assets/styles/global.scss';
import ErrorAppBoundary from '@/components/error/ErrorAppBoundary';
import ErrorPage from '@/components/error/ErrorPage';
import Unauthorized from '@/components/error/Unauthorized';
import Fallback from '@/components/fallback/Fallback';
import ModalContainer from '@/components/modal/ModalContainter';
import useAuth from '@/hooks/useAuth';
import useOAuth from '@/hooks/useOAuth';
import { useAppDispatch } from '@/hooks/useRedux';
import { ContextPath, ValidType } from '@/models/common/Constants';
import { setContextPath } from '@/reducers/authSlice';
import SessionApis from '@api/common/SessionApis';
import { Toaster, useToast } from '@components/ui';
import Watermark from '@uiw/react-watermark';
import SessionUtil from '@utils/SessionUtil';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';

const App = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const pathname = window.location.pathname;
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();
  const searchParameters = new URLSearchParams(window.location.search);
  const authorizationCode: any = searchParameters.get('code');

  if (!authorizationCode) {
    localStorage.setItem('accessPathname', pathname);
  }

  if (pathname.startsWith(ContextPath.ADMIN)) {
    dispatch(setContextPath(ContextPath.ADMIN));
  } else if (pathname.startsWith(ContextPath.POPUP)) {
    dispatch(setContextPath(ContextPath.POPUP));
  } else {
    dispatch(setContextPath(ContextPath.USER));
  }

  const { sessionRequestInfo, isError: oIsError } = useOAuth(sessionUtil, sessionApis);
  const {
    sessionInfo,
    router,
    isError: aIsError,
    unauthorized,
  } = useAuth(sessionUtil, sessionApis, sessionRequestInfo);

  useEffect(() => {
    if (oIsError) {
      toast({
        type: ValidType.ERROR,
        content: 'Google SSO 에러가 발생했습니다.',
      });
    } else if (aIsError) {
      toast({
        type: ValidType.ERROR,
        content: '로그인 중 에러가 발생했습니다.',
      });
    } else if (unauthorized) {
      toast({
        type: ValidType.ERROR,
        content: '권한이 없습니다.',
      });
    }
  }, [oIsError, aIsError, unauthorized, toast]);

  return (
    <ErrorBoundary fallback={<ErrorAppBoundary />}>
      <Suspense fallback={<Fallback />}>
        {(() => {
          if (oIsError || aIsError) {
            return <ErrorPage />;
          } else if (unauthorized) {
            return <Unauthorized />;
          } else if (sessionRequestInfo.googleAccessToken && sessionInfo.sessionId && router) {
            window.history.pushState({}, '', localStorage.getItem('accessPathname'));

            return (
              <Watermark content={sessionInfo.userEmail} className="width-100 height-100">
                <RouterProvider router={router} />
              </Watermark>
            );
          } else {
            <Fallback />;
          }
        })()}
        <ModalContainer />
        <Toaster />
      </Suspense>
    </ErrorBoundary>
  );
};
export default App;
