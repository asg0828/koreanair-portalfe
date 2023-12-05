import MyPage from '@/pages/MyPage';
import AdminHome from '@/pages/admin/AdminHome';
import Home from '@/pages/user/Home';
import Main from '@components/layout/Main';
import QuickMenu from '@components/layout/QuickMenu';
import { Page, Stack } from '@components/ui';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Body.scss';

export interface Props {
  onClick: Function;
}

const Body = ({ onClick }: Props) => {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/admin';
  const [content, setContent] = useState<any>();

  useEffect(() => {
    let content = <Main />;
    if (location.pathname === '/') {
      content = <Home />;
    } else if (location.pathname === '/admin') {
      content = <AdminHome />;
    } else if (location.pathname === '/mypage' || location.pathname === '/admin/mypage') {
      content = <MyPage />;
    }

    setContent(content);
  }, [location.pathname]);

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

          {content}
        </Stack>
      </Page>
    </Stack>
  );
};
export default Body;
