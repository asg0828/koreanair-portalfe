import { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ReducerType } from '@reducers';
import { menuSlice } from '@/reducers';
import Header from '@components/layout/Header';
import Body from '@components/layout/Body';
import Footer from '@components/layout/Footer';
import { defaultPathInfo } from '@/models/common/Menu';

export const defaultPath: defaultPathInfo = {
  '/biz-meta': '/biz-meta/feature',
  '/customer-info': '/customer-info/dashboard',
  '/report': '/report/structured-report',
  '/self-feature': '/self-feature/self-feature',
  '/feature': '/feature/interest',
  '/board': '/board/notice',
  '/admin': '/admin/user-management/user-management',
  '/admin/biz-meta-management': '/admin/biz-meta-management/feature',
  '/admin/admin-report': '/admin/admin-report/one-id-main',
  '/admin/admin-report/one-id-main': '/admin/admin-report/one-id-main/master-history',
  '/admin/admin-report/one-id-report': '/admin/admin-report/one-id-report/daily',
  '/admin/user-management': '/admin/user-management/user-management',
  '/admin/user-portal-management': '/admin/user-portal-management/menu-management',
  '/admin/user-portal-management/board-management': '/admin/user-portal-management/board-management/notice',
  '/admin/admin-portal-management': '/admin/admin-portal-management/menu-management',
  '/test': '/test/api',
};

const RootLayout = () => {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/\s*$/, '');
  const routePath = defaultPath[pathname];
  const isPopup = pathname.includes('/popup');

  const dispatch = useDispatch();
  const isDropMenu = useSelector((state: ReducerType) => state.menu.isDropMenu);

  useEffect(() => {
    handleCloseDropMenu();
  }, [location, dispatch]);

  const handleCloseDropMenu = () => {
    if (isDropMenu) {
      dispatch(menuSlice.actions.setIsDropMenu(!isDropMenu));
    }
  };

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
