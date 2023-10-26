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
    <Stack id="body" style={{background:'#f8f9fc',paddingBottom:'0.875rem'}} direction="Horizontal" alignItems="Start">
      <Page style={{padding:'0 1rem'}} fixedSize={true}>
        <Stack alignItems="Start" style={{position:"relative"}}>
          <QuickMenu />
          <Home /> 
        </Stack>
      </Page>
    </Stack>
    : 
    <Stack id="body" style={{paddingBottom:'0.875rem'}} direction="Horizontal" alignItems="Start">
      <Page style={{padding:'0 1rem',}} fixedSize={true}>
        <Stack alignItems="Start" style={{position:"relative"}}>
          <QuickMenu />
          <Main />
        </Stack>
      </Page>
    </Stack>
    }
    </>
);
};
export default Body;
