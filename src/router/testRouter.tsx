import TestAPI from '@/pages/test/TestAPI';
import TestModal from '@/pages/test/TestModal';
import TestAuth from '@/pages/test/TestAuth';
import TestHook from '@/pages/test/TestHook';

const testRouter = [
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
      {
        path: 'hook',
        element: <TestHook />,
        children: [],
      },
    ],
  },
];

export default testRouter;
