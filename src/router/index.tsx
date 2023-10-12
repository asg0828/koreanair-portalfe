import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { userRouter } from '@router/user';
import { adminRouter } from '@router/admin';

const Router = () => {
  const router = createBrowserRouter([...userRouter, ...adminRouter]);
  
  return <RouterProvider router={router} />;
};
export default Router;
