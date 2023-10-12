import Login from './pages/Login';
import Watermark from '@uiw/react-watermark';
import { Providers } from '@components/ui';
import '@/assets/styles/global.scss';

const App = () => {
  return (
    <Watermark
      content="워터마크"
    >
      <Providers>
        <Login />
      </Providers>
    </Watermark>
  )
};
export default App;
