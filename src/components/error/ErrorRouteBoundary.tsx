import ErrorPage from '@/components/error/ErrorPage';
import NotFound from '@/components/error/NotFound';
import { isRouteErrorResponse, useRouteError } from 'react-router';

const ErrorRouteBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }
  }

  return <ErrorPage />;
};
export default ErrorRouteBoundary;
