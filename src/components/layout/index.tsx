import { useLocation, Navigate } from 'react-router-dom';
import Header from '@components/layout/Header';
import Body from '@components/layout/Body';
import Footer from '@components/layout/Footer';
import { defaultPathInfo } from '@/models/common/Menu';

const defaultPath: defaultPathInfo = {
  '/board': '/board/notice',
  '/biz-meta': '/biz-meta/dataset',
  '/self-bi': '/self-bi/tableau',
  '/structured-report': '/structured-report/structured-report',
  '/feature': '/feature/popular',
  '/customer-info': '/customer-info/dashboard',
  '/self-feature': '/self-feature/self-feature',
  '/admin': '/admin/user-management/user-management',
  '/admin/user-management': '/admin/user-management/user-management',
  '/admin/user-portal-management': '/admin/user-portal-management/menu-management',
  '/admin/admin-portal-management': '/admin/admin-portal-management/menu-management',
};

const RootLayout = () => {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/\s*$/, "");
  const routePath = defaultPath[pathname];

  return (
    <>
      {routePath && <Navigate to={routePath} replace={true} />}

      <Header />
      <Body />
      <Footer />
    </>
  );
};
export default RootLayout;
