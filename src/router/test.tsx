import RootLayout from '@components/layout';
import Error from '@/pages/Error';
import TestAPI from '@/pages/test/TestAPI';
import TestModal from '@/pages/test/TestModal';
import TestAuth from '@/pages/test/TestAuth';

const testRouter = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'test',
        children: [
          { index: true, element: <TestAPI /> },
          {
            path: 'api',
            element: <TestAPI />,
            children: [],
          },
          {
            path: 'modal',
            element: <TestModal />,
            children: [],
          },
          {
            path: 'auth',
            element: <TestAuth />,
            children: [],
          },
        ],
      },
    ],
  },
];

export default testRouter;
