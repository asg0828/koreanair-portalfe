import ErrorPage from '@/components/error/ErrorPage';
import NotFound from '@/components/error/NotFound';
import MenuUnauthorized from '@/components/error/MenuUnauthorized';
import { useAppSelector } from '@/hooks/useRedux';
import { selectBaseMenuList } from '@/reducers/menuSlice';
import { isRouteErrorResponse, useLocation, useRouteError } from 'react-router';

const ErrorRouteBoundary = () => {
  const location = useLocation();
  const error = useRouteError();
  const baseMenuList = useAppSelector(selectBaseMenuList());

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
