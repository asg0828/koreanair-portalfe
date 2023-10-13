import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CustomRouterProps } from '@/models/components/Router';

const CustomRouter: React.FC<CustomRouterProps> = ({ router }) => {
  return <RouterProvider router={createBrowserRouter(router)} />;
};
export default CustomRouter;
