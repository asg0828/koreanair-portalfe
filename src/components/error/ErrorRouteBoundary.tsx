import ErrorPage from '@/components/error/ErrorPage';
import MenuUnauthorized from '@/components/error/MenuUnauthorized';
import NotFound from '@/components/error/NotFound';
import { useAppSelector } from '@/hooks/useRedux';
import { selectBaseMenuList } from '@/reducers/menuSlice';
import { Navigate, isRouteErrorResponse, useLocation, useRouteError } from 'react-router';

const ErrorRouteBoundary = () => {
  const location = useLocation();
  const error = useRouteError();
  const baseMenuList = useAppSelector(selectBaseMenuList());

  if (location.search.includes('?code=')) {
    return <Navigate to={localStorage.getItem('accessPathname') || ''} />;
  }

  if (baseMenuList.find((item) => item.menuUrl === location.pathname)) {
    return <MenuUnauthorized />;
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }
  }

  return <ErrorPage />;
};
export default ErrorRouteBoundary;
