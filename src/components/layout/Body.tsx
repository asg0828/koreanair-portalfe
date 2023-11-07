import AdminHome from '@/pages/admin/AdminHome';
import Home from '@/pages/user/Home';
import Main from '@components/layout/Main';
import QuickMenu from '@components/layout/QuickMenu';
import { Page, Stack } from '@components/ui';
import { useLocation } from 'react-router-dom';
import './Body.scss';

export interface Props {
  onClick: Function;
}

const Body = ({ onClick }: Props) => {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/admin';

  return (
    <Stack
      id="body"
      className={isHome ? 'is-home' : ''}
      direction="Horizontal"
      alignItems="Start"
      onClick={(e) => onClick()}
    >
      <Page style={{ padding: '0 1rem' }} fixedSize={true}>
        <Stack alignItems="Start" style={{ position: 'relative' }}>
          <QuickMenu />

          {location.pathname === '/' ? <Home /> : location.pathname === '/admin' ? <AdminHome /> : <Main />}
        </Stack>
      </Page>
    </Stack>
  );
};
export default Body;
