import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { selectMenuList, setCLevelModal, setIsDropMenu } from '@/reducers/menuSlice';
import { findMenuRecursive } from '@/utils/ArrayUtil';
import Body from '@components/layout/Body';
import Footer from '@components/layout/Footer';
import Header from '@components/layout/Header';
import { useCallback, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const menuList = useAppSelector(selectMenuList());
  const location = useLocation();
  const pathname = location.pathname.replace(/\/\s*$/, '');
  const isPopup = pathname.includes('/popup');
  const menu = findMenuRecursive(menuList, pathname);

  const handleCloseDropMenu = useCallback(() => {
    dispatch(setIsDropMenu(false));
    dispatch(setCLevelModal(false));
  }, [dispatch]);

  useEffect(() => {
    handleCloseDropMenu();
  }, [location, dispatch, handleCloseDropMenu]);

  return (
    <>
      {menu?.children?.length > 0 && !menu.children[0].isCrudPage && <Navigate to={menu.children[0].menuUrl} />}

      {isPopup ? (
        <Outlet />
      ) : (
        <>
          <Header />
          <Body
            onClick={() => {
              handleCloseDropMenu();
            }}
          />
          <Footer />
        </>
      )}
    </>
  );
};
export default RootLayout;
