import RootLayout from '@components/layout';
import Error from '@pages/Error';
import UserManagement from '@pages/admin/user-management/user-management';
import UserManagementDetail from '@pages/admin/user-management/user-management/Detail';
import AuthGroupManagement from '@pages/admin/user-management/auth-group-management';
import DepartmentGroupManagement from '@pages/admin/user-management/department-group-management';
import VirtualGroupManagement from '@pages/admin/user-management/virtual-group-management';
import MenuManagement from '@pages/admin/user-portal-management/menu-management';
import MenuAuthManagement from '@pages/admin/user-portal-management/menu-auth-management';
import AdminMenuManagement from '@pages/admin/admin-portal-management/menu-management';
import AdminAuthGroupManagement from '@pages/admin/admin-portal-management/auth-group-management';
import AdminAdminAuthManagement from '@pages/admin/admin-portal-management/admin-auth-management';

export const adminRouter = [
  {
    path: '/admin',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'user-management',
        children: [
          {
            path: 'user-management',
            children: [
              { index: true, element: <UserManagement /> },
              { path: 'detail', element: <UserManagementDetail /> },
            ],
          },
          {
            path: 'auth-group-management',
            element: <AuthGroupManagement />,
          },
          {
            path: 'department-management',
            element: <DepartmentGroupManagement />,
          },
          {
            path: 'virtual-group-management',
            element: <VirtualGroupManagement />,
          },
        ],
      },
      {
        path: 'user-portal-management',
        children: [
          {
            path: 'menu-management',
            element: <MenuManagement />,
          },
          {
            path: 'menu-auth-management',
            element: <MenuAuthManagement />,
          },
        ],
      },
      {
        path: 'admin-portal-management',
        children: [
          {
            path: 'menu-management',
            element: <AdminMenuManagement />,
          },
          {
            path: 'auth-group-management',
            element: <AdminAuthGroupManagement />,
          },
          {
            path: 'admin-auth-management',
            element: <AdminAdminAuthManagement />,
          },
        ],
      },
    ],
  },
];
