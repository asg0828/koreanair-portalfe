import { useSelector } from 'react-redux';
import { ReducerType } from '@reducers';
import OAuth from '@/pages/OAuth';
import LoginForm from '@components/form/LoginForm';
import Watermark from '@uiw/react-watermark';
import SessionUtil from '@utils/SessionUtil';
import { Toaster } from '@components/ui';
import '@/assets/styles/global.scss';

const App = () => {
  const auth = useSelector((state: ReducerType) => state.auth);
  const sessionUtil = new SessionUtil();

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
    <Watermark content={auth.userInfo?.userId} className="width-100 height-100">
      <LoginForm />
      <Toaster />
    </Watermark>
  );
};
export default App;
