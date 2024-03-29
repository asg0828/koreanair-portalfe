import '@/assets/styles/global.scss';
import ErrorAppBoundary from '@/components/error/ErrorAppBoundary';
import ErrorPage from '@/components/error/ErrorPage';
import Unauthorized from '@/components/error/Unauthorized';
import Fallback from '@/components/fallback/Fallback';
import ModalContainer from '@/components/modal/ModalContainer';
import useAuth from '@/hooks/useAuth';
import useOAuth from '@/hooks/useOAuth';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ValidType } from '@/models/common/Constants';
import { selectContextPath, setContextPath } from '@/reducers/authSlice';
import { setBaseApiUrl } from '@/utils/ApiUtil';
import SessionApis from '@api/common/SessionApis';
import { Toaster, useToast } from '@components/ui';
import Watermark from '@uiw/react-watermark';
import SessionUtil from '@utils/SessionUtil';
import { Suspense, useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const App = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const contextPath = useAppSelector(selectContextPath());
  const accessPathname = localStorage.getItem('accessPathname') || window.location.pathname + window.location.search;
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();
  const searchParameters = new URLSearchParams(window.location.search);
  const authorizationCode: any = searchParameters.get('code');

  const { sessionRequestInfo, isError: oIsError } = useOAuth(sessionUtil, sessionApis);
  const {
    sessionInfo,
    router,
    isError: aIsError,
    unauthorized,
  } = useAuth(sessionUtil, sessionApis, sessionRequestInfo);

  const initContextPath = useCallback(() => {
    if (contextPath === ContextPath.UNAUTHORIZED) {
      if (accessPathname.startsWith(ContextPath.ADMIN)) {
        dispatch(setContextPath(ContextPath.ADMIN));
        setBaseApiUrl('/bo');
      } else if (accessPathname.startsWith(ContextPath.POPUP)) {
        dispatch(setContextPath(ContextPath.POPUP));
        setBaseApiUrl('/fo');
      } else {
        dispatch(setContextPath(ContextPath.USER));
        setBaseApiUrl('/fo');
      }
    }
  }, [accessPathname, contextPath, dispatch]);

  useEffect(() => {
    if (sessionRequestInfo) {
      initContextPath();
    }
  }, [sessionRequestInfo, initContextPath, dispatch]);

  useEffect(() => {
    if (!sessionInfo.sessionId && !authorizationCode) {
      localStorage.setItem('accessPathname', accessPathname);
    }
  }, [accessPathname, authorizationCode, sessionInfo, initContextPath]);

  useEffect(() => {
    if (oIsError) {
      toast({
        type: ValidType.ERROR,
        content: t('login.toast.error.apigge'),
      });
    } else if (aIsError) {
      toast({
        type: ValidType.ERROR,
        content: t('login.toast.error.login'),
      });
    } else if (unauthorized) {
      toast({
        type: ValidType.ERROR,
        content: t('login.toast.error.unauthorized'),
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
          } else if (
            contextPath !== ContextPath.UNAUTHORIZED &&
            sessionRequestInfo.googleAccessToken &&
            sessionInfo.sessionId &&
            router
          ) {
            localStorage.removeItem('accessPathname');
            window.history.pushState(null, '', accessPathname);
            
            return (
              <Watermark content={sessionInfo.userEmail} className="width-100" style={{ minHeight: '100vh' }}>
                <RouterProvider router={createBrowserRouter(router)} />
              </Watermark>
            );
          } else {
            return <Fallback />;
          }
        })()}
        <ModalContainer />
        <Toaster />
      </Suspense>
    </ErrorBoundary>
  );
};
export default App;
