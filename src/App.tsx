import '@/assets/styles/global.scss';
import OAuth from '@/pages/OAuth';
import LoginForm from '@components/form/LoginForm';
import { Loader, Stack, Toaster } from '@components/ui';
import { ReducerType } from '@reducers';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Watermark from '@uiw/react-watermark';
import SessionUtil from '@utils/SessionUtil';
import { Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalContainer from './components/modal/ModalContainter';

const App = () => {
  const auth = useSelector((state: ReducerType) => state.auth);
  const sessionUtil = new SessionUtil();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {},
        }),
        defaultOptions: {
          queries: {
            suspense: true,
            enabled: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 0,
            cacheTime: 0,
          },
          mutations: {
            cacheTime: 0,
            onError: (error, query) => {},
          },
        },
      })
  );

  if (window.location.pathname.substring(0, 6) === '/popup') {
    if (sessionUtil.getRefreshLocalToken()) {
      const localStorageTokenInfo = sessionUtil.getLocalAccessTokenRefreshTokenInfo();
      sessionUtil.setAccessTokenRefreshTokenInfo(localStorageTokenInfo);
      sessionUtil.deleteLocalStorage();
    }
  }

  if (!sessionUtil.getRefreshToken()) {
    return <OAuth />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <Stack justifyContent="Center" className="width-100 height-100">
            <Loader title="진행중" description="잠시만 기다려주세요" />
          </Stack>
        }
      >
        <Watermark content={auth.userInfo?.userId} className="width-100 height-100">
          <LoginForm />
        </Watermark>
      </Suspense>

      <ModalContainer />
      <Toaster />
    </QueryClientProvider>
  );
};
export default App;
