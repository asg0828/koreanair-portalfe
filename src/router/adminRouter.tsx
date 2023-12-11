import { useDatasetLoader, useFaqLoader, useFeatureLoader, useMainLoader, useQnaLoader } from '@/hooks/useLoader';
import MyPage from '@/pages/MyPage';
import AdminHome from '@/pages/admin/AdminHome';
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
import AdminAdminAuthManagement from '@pages/admin/admin-portal-management/admin-auth-management';
import AdminMenuManagement from '@pages/admin/admin-portal-management/menu-management';
import DataConversion from '@pages/admin/admin-report/data-conversion';
import OneIdErrorHistory from '@pages/admin/admin-report/one-id-error-history';
import MasterHistory from '@pages/admin/admin-report/one-id-main/master-history';
import MobileNumber from '@pages/admin/admin-report/one-id-main/mobile-number';
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
  {
    path: 'admin',
    children: [
      { index: true, element: <AdminHome /> },
      {
        path: 'biz-meta-management',
        children: [
          {
            id: '/biz-meta/feature',
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
        path: 'feature',
        children: [
          { index: true, element: <InterestFeature /> },
          { path: 'interest', element: <InterestFeature /> },
          { path: 'popular', element: <PopularFeature /> },
        ],
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
          {
            path: 'user-management',
            children: [
              { index: true, element: <UserManagement /> },
              { path: 'detail', element: <UserManagementDetail /> },
            ],
          },
          { path: 'user-auth-group-management', element: <AuthGroupManagement /> },
          { path: 'admin-auth-group-management', element: <AdminAuthGroupManagement /> },
          { path: 'department-management', element: <DepartmentGroupManagement /> },
          { path: 'user-exception-management', element: <UserExceptionManagement /> },
        ],
      },
      {
        path: 'user-portal-management',
        children: [
          { path: 'menu-management', element: <MenuManagement /> },
          { path: 'menu-auth-management', element: <MenuAuthManagement /> },
          {
            path: 'board-management',
            children: [
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
                loader: useFaqLoader,
                children: [
                  { index: true, element: <Faq /> },
                  { path: 'reg', element: <FaqReg /> },
                  { path: 'edit', element: <FaqEdit /> },
                ],
              },
              {
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
        path: 'admin-portal-management',
        children: [
          { path: 'menu-management', element: <AdminMenuManagement /> },
          { path: 'admin-auth-management', element: <AdminAdminAuthManagement /> },
        ],
      },
      {
        path: 'self-feature-meta-management',
        children: [
          {
            path: 'customer-meta-management',
            children: [
              { index: true, element: <CustomerMetaManagement /> },
              { path: 'detail', element: <CustomerMetaManagementDetail /> },
              { path: 'reg', element: <CustomerMetaManagementReg /> },
            ],
          },
          {
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
        children: [{ index: true, element: <MyPage /> }],
      },
    ],
  },
];

export default adminRouter;
