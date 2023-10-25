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
import DataSet from '@pages/user/biz-meta/dataset';
import DataSetDetail from '@pages/user/biz-meta/dataset/Detail';
import DataSetReg from '@pages/user/biz-meta/dataset/Reg';
import DataSetEdit from '@pages/user/biz-meta/dataset/Edit';
import Feature from '@pages/user/biz-meta/feature';
import FeatureDetail from '@pages/user/biz-meta/feature/Detail';
import FeatureReg from '@pages/user/biz-meta/feature/Reg';
import FeatureEdit from '@pages/user/biz-meta/feature/Edit';
import MasterHistory from '@pages/admin/admin-report/one-id-main/master-history';
import MobileNumber from '@pages/admin/admin-report/one-id-main/mobile-number';
import PaxMapping from '@pages/admin/admin-report/one-id-main/pax-mapping';
import RelationshipHistoryTable from '@pages/admin/admin-report/one-id-main/relationship-history-table';
import OneIdErrorHistory from '@pages/admin/admin-report/one-id-error-history';
import Ctivoc from '@pages/admin/admin-report/one-id-report/ctivoc';
import Daily from '@pages/admin/admin-report/one-id-report/daily';
import SamePnrUcild from '@pages/admin/admin-report/one-id-report/same-pnr-ucild';
import DataConversion from '@pages/admin/admin-report/data-conversion';

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
            path: 'biz-meta-management',
            children: [
              { index: true, element: <Feature /> },
              {
                path: 'feature',
                children: [
                  { index: true, element: <Feature /> },
                  { path: 'detail', element: <FeatureDetail /> },
                  { path: 'reg', element: <FeatureReg /> },
                  { path: 'edit', element: <FeatureEdit /> },
                ],
              },
              {
                path: 'dataset',
                children: [
                  { index: true, element: <DataSet /> },
                  { path: 'detail', element: <DataSetDetail /> },
                  { path: 'reg', element: <DataSetReg /> },
                  { path: 'edit', element: <DataSetEdit /> },
                ],
              },
            ],
          },
          {
            path: 'structured-report-management',
            children: [],
          },
          {
            path: 'admin-report',
            children: [
              {
                path: 'one-id-main',
                children: [
                  { index: true, element: <MasterHistory /> },
                  { path: 'master-history', element: <MasterHistory /> },
                  { path: 'mobile-number', element: <MobileNumber /> },
                  { path: 'pax-mapping', element: <PaxMapping /> },
                  { path: 'relationship-history-table', element: <RelationshipHistoryTable /> },
                ],
              },
              { path: 'one-id-error-history', element: <OneIdErrorHistory /> },
              {
                path: 'one-id-report',
                children: [
                  { index: true, element: <Daily /> },
                  { path: 'daily', element: <Daily /> },
                  { path: 'ctivoc', element: <Ctivoc /> },
                  { path: 'same-pnr-ucild', element: <SamePnrUcild /> },
                ],
              },
              { path: 'data-conversion', element: <DataConversion /> },
            ],
          },
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
