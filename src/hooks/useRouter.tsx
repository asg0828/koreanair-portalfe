import ErrorRouteBoundary from '@/components/error/ErrorRouteBoundary';
import { useMainLoader } from '@/hooks/useLoader';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import RootLayout from '@components/layout';
import { useEffect, useState } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const useRouter = (routerList: any) => {
  const contextPath = useAppSelector(selectContextPath());
  const [router, setRouter] = useState<any>();

  useEffect(() => {
    if (routerList.length > 0 && !router) {
      const router = [
        {
          path: '/',
          loader: useMainLoader,
          element: <RootLayout />,
          errorElement: <ErrorRouteBoundary />,
          children: routerList,
        },
      ];
      setRouter(createBrowserRouter(router));
    }
  }, [contextPath, routerList, router]);

  return [router, setRouter];
};

export default useRouter;
