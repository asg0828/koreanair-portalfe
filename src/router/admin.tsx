import RootLayout from '@components/layout';
import Error from '@/pages/Error';
import UserManagement from '@pages/admin/user-management/user-management';
import UserManagementDetail from '@pages/admin/user-management/user-management/Detail';
import AuthGroupManagement from '@pages/admin/user-management/auth-group-management';
import DepartmentGroupManagement from '@pages/admin/user-management/department-group-management';
import UserExceptionManagement from '@pages/admin/user-management/user-exception-management';
import MenuManagement from '@pages/admin/user-portal-management/menu-management';
import MenuAuthManagement from '@pages/admin/user-portal-management/menu-auth-management';
import AdminMenuManagement from '@pages/admin/admin-portal-management/menu-management';
import AdminAuthGroupManagement from '@pages/admin/admin-portal-management/auth-group-management';
import AdminAdminAuthManagement from '@pages/admin/admin-portal-management/admin-auth-management';
import Notice from '@pages/user/board/notice';
import NoticeDetail from '@pages/user/board/notice/Detail';
import NoticeReg from '@pages/user/board/notice/Reg';
import NoticeEdit from '@pages/user/board/notice/Edit';
import Faq from '@pages/user/board/faq';
import FaqDetail from '@pages/user/board/faq/Detail';
import FaqReg from '@pages/user/board/faq/Reg';
import FaqEdit from '@pages/user/board/faq/Edit';
import Qna from '@pages/user/board/qna';
import QnaDetail from '@pages/user/board/qna/Detail';
import QnaReg from '@pages/user/board/qna/Reg';
import QnaEdit from '@pages/user/board/qna/Edit';
import Archive from '@pages/user/board/archive';
import ArchiveDetail from '@pages/user/board/archive/Detail';
import ArchiveReg from '@pages/user/board/archive/Reg';
import ArchiveEdit from '@pages/user/board/archive/Edit';

const adminRouter = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'admin',
        children: [
          {
            path: 'user-management',
            children: [
              { index: true, element: <UserManagement /> },
              {
                path: 'user-management',
                children: [
                  { index: true, element: <UserManagement /> },
                  { path: 'detail', element: <UserManagementDetail /> },
                ],
              },
              { path: 'auth-group-management', element: <AuthGroupManagement /> },
              { path: 'department-management', element: <DepartmentGroupManagement /> },
              { path: 'user-exception-management', element: <UserExceptionManagement /> },
            ],
          },
          {
            path: 'user-portal-management',
            children: [
              { index: true, element: <MenuManagement /> },
              { path: 'menu-management', element: <MenuManagement /> },
              { path: 'menu-auth-management', element: <MenuAuthManagement /> },
              {
                path: 'board-management',
                children: [
                  { index: true, element: <Notice /> },
                  {
                    path: 'notice',
                    children: [
                      { index: true, element: <Notice /> },
                      { path: 'detail', element: <NoticeDetail /> },
                      { path: 'reg', element: <NoticeReg /> },
                      { path: 'edit', element: <NoticeEdit /> },
                    ],
                  },
                  {
                    path: 'faq',
                    children: [
                      { index: true, element: <Faq /> },
                      { path: 'detail', element: <FaqDetail /> },
                      { path: 'reg', element: <FaqReg /> },
                      { path: 'edit', element: <FaqEdit /> },
                    ],
                  },
                  {
                    path: 'qna',
                    children: [
                      { index: true, element: <Qna /> },
                      { path: 'detail', element: <QnaDetail /> },
                      { path: 'reg', element: <QnaReg /> },
                      { path: 'edit', element: <QnaEdit /> },
                    ],
                  },
                  {
                    path: 'archive',
                    children: [
                      { index: true, element: <Archive /> },
                      { path: 'detail', element: <ArchiveDetail /> },
                      { path: 'reg', element: <ArchiveReg /> },
                      { path: 'edit', element: <ArchiveEdit /> },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'admin-portal-management',
            children: [
              { index: true, element: <AdminMenuManagement /> },
              { path: 'menu-management', element: <AdminMenuManagement /> },
              { path: 'auth-group-management', element: <AdminAuthGroupManagement /> },
              { path: 'admin-auth-management', element: <AdminAdminAuthManagement /> },
            ],
          },
        ],
      },
    ],
  },
];

export default adminRouter;
