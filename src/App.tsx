import { useSelector } from 'react-redux';
import { ReducerType } from '@reducers';
import Login from './pages/Login';
import Watermark from '@uiw/react-watermark';
import { Toaster } from '@components/ui';
import '@/assets/styles/global.scss';

const App = () => {
  const auth = useSelector((state: ReducerType) => state.auth);

  return (
    <Watermark
      content={auth.userInfo?.userId}
      className="width-100 height-100"
    >
      <Login />
      <Toaster />
    </Watermark>
  )
};
export default App;
