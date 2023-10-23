import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import userRouter from '@router/user';
import adminRouter from '@router/admin';
import testRouter from '@router/test';

export interface CustomRouterProps {
  router: Array<RouteObject>;
}

const CustomRouter: React.FC<CustomRouterProps> = ({ router }) => {
  return <RouterProvider router={createBrowserRouter(router)} />;
};
export default CustomRouter;

export {
  userRouter,
  adminRouter,
  testRouter,
}