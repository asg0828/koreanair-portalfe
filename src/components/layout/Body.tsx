import { useLocation } from 'react-router-dom';
import Home from '@/pages/user/Home';
import Main from '@components/layout/Main';
import QuickMenu from '@components/layout/QuickMenu';
import { Stack } from '@components/ui';
import './Body.scss';

const Body = () => {
  const location = useLocation();

  return (
    <Stack id="body" direction="Horizontal" alignItems="Start">
      <QuickMenu />

      {location.pathname === '/' ? <Home /> : <Main />}
    </Stack>
  );
};
export default Body;
