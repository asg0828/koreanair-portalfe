import { useDatasetLoader, useFaqLoader, useFeatureLoader, useQnaLoader } from '@/hooks/useLoader';
import MyPage from '@/pages/MyPage';
import AdminHome from '@/pages/admin/AdminHome';
import AdminAdminAuthManagement from '@/pages/admin/admin-portal-management/menu-auth-management';
import CustomerMetaManagement from '@/pages/admin/self-feature-meta-management/customer-meta-management';
import CustomerMetaManagementDetail from '@/pages/admin/self-feature-meta-management/customer-meta-management/Detail';
import CustomerMetaManagementReg from '@/pages/admin/self-feature-meta-management/customer-meta-management/Reg';
import MasterProfileManagement from '@/pages/admin/self-feature-meta-management/master-profile-management';
import MasterProfileManagementDetail from '@/pages/admin/self-feature-meta-management/master-profile-management/Detail';
import MasterProfileManagementEdit from '@/pages/admin/self-feature-meta-management/master-profile-management/Edit';
import MasterProfileManagementReg from '@/pages/admin/self-feature-meta-management/master-profile-management/Reg';
import AdminAuthGroupManagement from '@/pages/admin/user-management/admin-auth-group-management';
import AuthGroupManagement from '@/pages/admin/user-management/user-auth-group-management';
import Dataroom from '@/pages/user/board/dataroom';
import DataroomDetail from '@/pages/user/board/dataroom/Detail';
import DataroomEdit from '@/pages/user/board/dataroom/Edit';
import DataroomReg from '@/pages/user/board/dataroom/Reg';
import AdminMenuManagement from '@pages/admin/admin-portal-management/menu-management';
import DataConversion from '@pages/admin/admin-report/data-conversion';
import OneIdErrorHistory from '@pages/admin/admin-report/one-id-error-history';
import MasterHistory from '@pages/admin/admin-report/one-id-main/master-history';
import MobileNumber from '@pages/admin/admin-report/one-id-main/mobile-number';
import Email from '@pages/admin/admin-report/one-id-main/email'
import PaxMapping from '@pages/admin/admin-report/one-id-main/pax-mapping';
import RelationshipHistoryTable from '@pages/admin/admin-report/one-id-main/relationship-history-table';
import Ctivoc from '@pages/admin/admin-report/one-id-report/ctivoc';
import Daily from '@pages/admin/admin-report/one-id-report/daily';
import SamePnrUcild from '@pages/admin/admin-report/one-id-report/same-pnr-ucild';
import DepartmentGroupManagement from '@pages/admin/user-management/department-group-management';
import UserExceptionManagement from '@pages/admin/user-management/user-exception-management';
import UserManagement from '@pages/admin/user-management/user-management';
import UserManagementDetail from '@pages/admin/user-management/user-management/Detail';
import MenuAuthManagement from '@pages/admin/user-portal-management/menu-auth-management';
import MenuManagement from '@pages/admin/user-portal-management/menu-management';
import DataSet from '@pages/user/biz-meta/dataset';
import DataSetDetail from '@pages/user/biz-meta/dataset/Detail';
import DataSetEdit from '@pages/user/biz-meta/dataset/Edit';
import DataSetReg from '@pages/user/biz-meta/dataset/Reg';
import Feature from '@pages/user/biz-meta/feature';
import FeatureDetail from '@pages/user/biz-meta/feature/Detail';
import FeatureEdit from '@pages/user/biz-meta/feature/Edit';
import FeatureReg from '@pages/user/biz-meta/feature/Reg';
import Faq from '@pages/user/board/faq';
import FaqEdit from '@pages/user/board/faq/Edit';
import FaqReg from '@pages/user/board/faq/Reg';
import Notice from '@pages/user/board/notice';
import NoticeDetail from '@pages/user/board/notice/Detail';
import NoticeEdit from '@pages/user/board/notice/Edit';
import NoticeReg from '@pages/user/board/notice/Reg';
import Qna from '@pages/user/board/qna';
import QnaDetail from '@pages/user/board/qna/Detail';
import QnaEdit from '@pages/user/board/qna/Edit';
import QnaReg from '@pages/user/board/qna/Reg';
import InterestFeature from '@pages/user/feature/interest';
import PopularFeature from '@pages/user/feature/popular';

const adminRouter = [
  { index: true, element: <AdminHome /> },
  {
    id: '/admin/biz-meta-management',
    path: 'biz-meta-management',
    children: [
      {
        id: '/admin/biz-meta-management/feature',
        path: 'feature',
        loader: useFeatureLoader,
        children: [
          { index: true, element: <Feature /> },
          { path: 'detail', element: <FeatureDetail /> },
          { path: 'reg', element: <FeatureReg /> },
          { path: 'edit', element: <FeatureEdit /> },
        ],
      },
      {
        id: '/admin/biz-meta-management/dataset',
        path: 'dataset',
        loader: useDatasetLoader,
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
    id: '/admin/feature',
    path: 'feature',
    children: [
      { index: true, element: <InterestFeature /> },
      { path: 'interest', element: <InterestFeature /> },
      { path: 'popular', element: <PopularFeature /> },
    ],
  },
  {
    id: '/admin/admin-report',
    path: 'admin-report',
    children: [
      {
        id: '/admin/admin-report/one-id-main',
        path: 'one-id-main',
        children: [
          { id: '/admin/admin-report/one-id-main/master-history', path: 'master-history', element: <MasterHistory /> },
          { id: '/admin/admin-report/one-id-main/mobile-number', path: 'mobile-number', element: <MobileNumber /> },
          { id: '/admin/admin-report/one-id-main/email', path: 'email', element: <Email /> },
          { id: '/admin/admin-report/one-id-main/pax-mapping', path: 'pax-mapping', element: <PaxMapping /> },
          {
            id: '/admin/admin-report/one-id-main/relationship-history-table',
            path: 'relationship-history-table',
            element: <RelationshipHistoryTable />,
          },
        ],
      },
      { id: '/admin/admin-report/one-id-error-history', path: 'one-id-error-history', element: <OneIdErrorHistory /> },
      {
        id: '/admin/admin-report/one-id-report',
        path: 'one-id-report',
        children: [
          { path: 'daily', element: <Daily /> },
          { path: 'ctivoc', element: <Ctivoc /> },
          { path: 'same-pnr-ucild', element: <SamePnrUcild /> },
        ],
      },
      { id: '/admin/admin-report/data-conversion', path: 'data-conversion', element: <DataConversion /> },
    ],
  },
  {
    id: '/admin/user-management',
    path: 'user-management',
    children: [
      {
        id: '/admin/user-management/user-management',
        path: 'user-management',
        children: [
          { index: true, element: <UserManagement /> },
          { path: 'detail', element: <UserManagementDetail /> },
        ],
      },
      {
        id: '/admin/user-management/user-auth-group-management',
        path: 'user-auth-group-management',
        element: <AuthGroupManagement />,
      },
      {
        id: '/admin/user-management/admin-auth-group-management',
        path: 'admin-auth-group-management',
        element: <AdminAuthGroupManagement />,
      },
      {
        id: '/admin/user-management/department-management',
        path: 'department-management',
        element: <DepartmentGroupManagement />,
      },
      {
        id: '/admin/user-management/user-exception-management',
        path: 'user-exception-management',
        element: <UserExceptionManagement />,
      },
    ],
  },
  {
    id: '/admin/user-portal-management',
    path: 'user-portal-management',
    children: [
      { id: '/admin/user-portal-management/menu-management', path: 'menu-management', element: <MenuManagement /> },
      {
        id: '/admin/user-portal-management/menu-auth-management',
        path: 'menu-auth-management',
        element: <MenuAuthManagement />,
      },
      {
        id: '/admin/user-portal-management/board-management',
        path: 'board-management',
        children: [
          {
            id: '/admin/user-portal-management/board-management/notice',
            path: 'notice',
            children: [
              { index: true, element: <Notice /> },
              { path: 'detail', element: <NoticeDetail /> },
              { path: 'reg', element: <NoticeReg /> },
              { path: 'edit', element: <NoticeEdit /> },
            ],
          },
          {
            id: '/admin/user-portal-management/board-management/faq',
            path: 'faq',
            loader: useFaqLoader,
            children: [
              { index: true, element: <Faq /> },
              { path: 'reg', element: <FaqReg /> },
              { path: 'edit', element: <FaqEdit /> },
            ],
          },
          {
            id: '/admin/user-portal-management/board-management/qna',
            path: 'qna',
            loader: useQnaLoader,
            children: [
              { index: true, element: <Qna /> },
              { path: 'detail', element: <QnaDetail /> },
              { path: 'reg', element: <QnaReg /> },
              { path: 'edit', element: <QnaEdit /> },
            ],
          },
          {
            id: '/admin/user-portal-management/board-management/dataroom',
            path: 'dataroom',
            children: [
              { index: true, element: <Dataroom /> },
              { path: 'detail', element: <DataroomDetail /> },
              { path: 'reg', element: <DataroomReg /> },
              { path: 'edit', element: <DataroomEdit /> },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '/admin/admin-portal-management',
    path: 'admin-portal-management',
    children: [
      {
        id: '/admin/admin-portal-management/menu-management',
        path: 'menu-management',
        element: <AdminMenuManagement />,
      },
      {
        id: '/admin/admin-portal-management/admin-auth-management',
        path: 'admin-auth-management',
        element: <AdminAdminAuthManagement />,
      },
    ],
  },
  {
    id: '/admin/self-feature-meta-management',
    path: 'self-feature-meta-management',
    children: [
      {
        id: '/admin/self-feature-meta-management/customer-meta-management',
        path: 'customer-meta-management',
        children: [
          { index: true, element: <CustomerMetaManagement /> },
          { path: 'detail', element: <CustomerMetaManagementDetail /> },
          { path: 'reg', element: <CustomerMetaManagementReg /> },
        ],
      },
      {
        id: '/admin/self-feature-meta-management/master-profile-management',
        path: 'master-profile-management',
        children: [
          { index: true, element: <MasterProfileManagement /> },
          { path: 'detail', element: <MasterProfileManagementDetail /> },
          { path: 'reg', element: <MasterProfileManagementReg /> },
          { path: 'edit', element: <MasterProfileManagementEdit /> },
        ],
      },
    ],
  },
  {
    path: 'mypage',
    element: <MyPage />,
  },
];

export default adminRouter;
