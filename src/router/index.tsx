import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

export interface CustomRouterProps {
  router: Array<RouteObject>;
}

const CustomRouter: React.FC<CustomRouterProps> = ({ router }) => {
  return <RouterProvider router={createBrowserRouter(router)} />;
};
export default CustomRouter;
