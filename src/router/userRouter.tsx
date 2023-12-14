import { useDatasetLoader, useFaqLoader, useFeatureLoader, useQnaLoader } from '@/hooks/useLoader';
import MyPage from '@/pages/MyPage';
import Dataroom from '@/pages/user/board/dataroom';
import DataroomDetail from '@/pages/user/board/dataroom/Detail';
import DataroomEdit from '@/pages/user/board/dataroom/Edit';
import DataroomReg from '@/pages/user/board/dataroom/Reg';
import SfSubmissionRequest from '@/pages/user/self-feature-submission';
import SfSubmissionRequestDetail from '@/pages/user/self-feature-submission/Detail';
import SelfFeatureDetail from '@/pages/user/self-feature/Detail';
import Home from '@pages/user/Home';
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
import CustomerInfo from '@pages/user/customer-info/dashboard';
import InterestFeature from '@pages/user/feature/interest';
import PopularFeature from '@pages/user/feature/popular';
import SelfFeature from '@pages/user/self-feature';
import SelfFeatureEdit from '@pages/user/self-feature/Edit';
import SelfFeatureReg from '@pages/user/self-feature/Reg';
import DomesticBoarding from '@pages/user/structured-report/domestic-boarding';
import InternationalBoarding from '@pages/user/structured-report/international-boarding';
import PurchaseContributors from '@pages/user/structured-report/purchase-contributors';
import SavedMileage from '@pages/user/structured-report/saved-mileage';
import VipCustomerFlightStatus from '@pages/user/structured-report/vip-customer-flight-status';
import Tableau from '@pages/user/tableau';

const userRouter = [
  { index: true, element: <Home /> },
  {
    id: '/biz-meta',
    path: 'biz-meta',
    children: [
      {
        id: '/biz-meta/feature',
        path: 'feature',
        loader: useFeatureLoader,
        children: [
          { index: true, element: <Feature /> },
          { path: 'reg', element: <FeatureReg /> },
          { path: 'detail', element: <FeatureDetail /> },
          { path: 'edit', element: <FeatureEdit /> },
        ],
      },
      {
        id: '/biz-meta/dataset',
        path: 'dataset',
        loader: useDatasetLoader,
        children: [
          { index: true, element: <DataSet /> },
          { path: 'reg', element: <DataSetReg /> },
          { path: 'detail', element: <DataSetDetail /> },
          { path: 'edit', element: <DataSetEdit /> },
        ],
      },
    ],
  },
  {
    id: '/customer-info',
    path: 'customer-info',
    children: [
      { index: true, element: <CustomerInfo /> },
      { path: 'dashboard', element: <CustomerInfo /> },
    ],
  },
  {
    id: '/structured-report',
    path: 'structured-report',
    children: [
      {
        id: '/structured-report/vip-intl-flight-reservation-status',
        path: 'vip-intl-flight-reservation-status',
        element: <VipCustomerFlightStatus />,
      },
      {
        id: '/structured-report/purchase-contributors',
        path: 'purchase-contributors',
        element: <PurchaseContributors />,
      },
      {
        id: '/structured-report/international-boarding',
        path: 'international-boarding',
        element: <InternationalBoarding />,
      },
      { id: '/structured-report/domestic-boarding', path: 'domestic-boarding', element: <DomesticBoarding /> },
      { id: '/structured-report/saved-mileage', path: 'saved-mileage', element: <SavedMileage /> },
    ],
  },
  {
    id: '/self-feature',
    path: 'self-feature',
    children: [
      {
        id: '/self-feature/self-feature',
        path: 'self-feature',
        loader: useFeatureLoader,
        children: [
          { index: true, element: <SelfFeature /> },
          { path: 'detail', element: <SelfFeatureDetail /> },
          { path: 'reg', element: <SelfFeatureReg /> },
          { path: 'edit', element: <SelfFeatureEdit /> },
        ],
      },
      {
        id: '/self-feature/submission-request',
        path: 'submission-request',
        loader: useFeatureLoader,
        children: [
          { index: true, element: <SfSubmissionRequest /> },
          { path: 'detail', element: <SfSubmissionRequestDetail /> },
        ],
      },
    ],
  },
  {
    id: '/feature',
    path: 'feature',
    children: [
      { index: true, element: <InterestFeature /> },
      { path: 'interest', element: <InterestFeature /> },
      { path: 'popular', element: <PopularFeature /> },
    ],
  },
  {
    id: '/board',
    path: 'board',
    children: [
      {
        id: '/board/notice',
        path: 'notice',
        children: [
          { index: true, element: <Notice /> },
          { path: 'detail', element: <NoticeDetail /> },
          { path: 'reg', element: <NoticeReg /> },
          { path: 'edit', element: <NoticeEdit /> },
        ],
      },
      {
        id: '/board/faq',
        path: 'faq',
        loader: useFaqLoader,
        children: [
          { index: true, element: <Faq /> },
          { path: 'reg', element: <FaqReg /> },
          { path: 'edit', element: <FaqEdit /> },
        ],
      },
      {
        id: '/board/qna',
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
        id: '/board/dataroom',
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
  {
    id: '/popup/tableau',
    path: 'https://ssbiprdap.koreanair.com/#/projects/180',
    element: <Tableau />,
  },
  {
    path: 'mypage',
    element: <MyPage />,
  },
];

export default userRouter;
