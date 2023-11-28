import { useAppDispatch } from '@/hooks/useRedux';
import { defaultPathInfo } from '@/models/common/Menu';
import { setIsDropMenu } from '@/reducers/menuSlice';
import Body from '@components/layout/Body';
import Footer from '@components/layout/Footer';
import Header from '@components/layout/Header';
import { useCallback, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const defaultPath: defaultPathInfo = {
  '/biz-meta': '/biz-meta/feature',
  '/customer-info': '/customer-info/dashboard',
  '/structured-report': '/structured-report',
  '/self-feature': '/self-feature/self-feature',
  '/feature': '/feature/interest',
  '/board': '/board/notice',
  '/admin/biz-meta-management': '/admin/biz-meta-management/feature',
  '/admin/admin-report': '/admin/admin-report/one-id-main',
  '/admin/admin-report/one-id-main': '/admin/admin-report/one-id-main/master-history',
  '/admin/admin-report/one-id-report': '/admin/admin-report/one-id-report/daily',
  '/admin/user-management': '/admin/user-management/user-management',
  '/admin/user-portal-management': '/admin/user-portal-management/menu-management',
  '/admin/user-portal-management/board-management': '/admin/user-portal-management/board-management/notice',
  '/admin/admin-portal-management': '/admin/admin-portal-management/menu-management',
  '/admin/self-feature-meta-management': '/admin/self-feature-meta-management/customer-meta-management',
  '/test': '/test/api',
};

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
