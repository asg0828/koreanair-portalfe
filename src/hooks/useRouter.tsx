import { useAppSelector } from '@/hooks/useRedux';
import Error from '@/pages/Error';
import RootLayout from '@components/layout';
import { useEffect, useState } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const useRouter = (routerList: any) => {
  const contextPath = useAppSelector((state) => state.auth.contextPath);
  const [router, setRouter] = useState<any>();

  useEffect(() => {
    if (routerList.length > 0 && !router) {
      (async () => {
        const router = [
          {
            path: '/',
            element: <RootLayout />,
            errorElement: <Error />,
            children: routerList,
          },
        ];
        setRouter(createBrowserRouter(router));
      })();
    }
  }, [contextPath, routerList, router]);

  return [router, setRouter];
};

export default useRouter;
