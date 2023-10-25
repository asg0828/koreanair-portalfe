import { useLocation } from 'react-router-dom';
import Home from '@/pages/user/Home';
import Main from '@components/layout/Main';
import QuickMenu from '@components/layout/QuickMenu';
import { Stack,Page } from '@components/ui';
import './Body.scss';

const Body = () => {
  const location = useLocation();

  return (
    <>
    {location.pathname === '/' ? 
    <Stack id="body" style={{background:'#f8f9fc',paddingBottom:'14px'}} direction="Horizontal" alignItems="Start">
      <Page style={{padding:'0 20px'}} fixedSize={true}>
        <Stack alignItems="Start">
          <QuickMenu />
          <Home /> 
        </Stack>
      </Page>
    </Stack>
    : 
    <Stack id="body" direction="Horizontal" alignItems="Start">
      <Page style={{padding:'0 20px'}} fixedSize={true}>
        <Main />
      </Page>
    </Stack>
    }
    </>
);
};
export default Body;
