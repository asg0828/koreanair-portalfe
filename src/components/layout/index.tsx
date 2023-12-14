import { useAppDispatch } from '@/hooks/useRedux';
import { defaultPath } from '@/models/common/Menu';
import { setIsDropMenu } from '@/reducers/menuSlice';
import Body from '@components/layout/Body';
import Footer from '@components/layout/Footer';
import Header from '@components/layout/Header';
import { useCallback, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RootLayout = () => {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/\s*$/, '');
  const routePath = defaultPath[pathname];
  const isPopup = pathname.includes('/popup');

  const dispatch = useAppDispatch();

  const handleCloseDropMenu = useCallback(() => {
    dispatch(setIsDropMenu(false));
  }, [dispatch]);

  useEffect(() => {
    handleCloseDropMenu();
  }, [location, dispatch, handleCloseDropMenu]);

  return (
    <>
      {routePath && <Navigate to={routePath} replace={true} />}

      {isPopup ? (
        <Outlet />
      ) : (
        <>
          <Header />
          <Body onClick={handleCloseDropMenu} />
          <Footer />
        </>
      )}
    </>
  );
};
export default RootLayout;
