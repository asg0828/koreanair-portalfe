import Home from '@pages/user/Home';
import DataSet from '@pages/user/biz-meta/dataset';
import DataSetDetail from '@pages/user/biz-meta/dataset/Detail';
import DataSetReg from '@pages/user/biz-meta/dataset/Reg';
import DataSetEdit from '@pages/user/biz-meta/dataset/Edit';
import Feature from '@pages/user/biz-meta/feature';
import FeatureDetail from '@pages/user/biz-meta/feature/Detail';
import FeatureReg from '@pages/user/biz-meta/feature/Reg';
import FeatureEdit from '@pages/user/biz-meta/feature/Edit';
import Notice from '@pages/user/board/notice';
import NoticeDetail from '@pages/user/board/notice/Detail';
import NoticeReg from '@pages/user/board/notice/Reg';
import NoticeEdit from '@pages/user/board/notice/Edit';
import Faq from '@pages/user/board/faq';
import FaqReg from '@pages/user/board/faq/Reg';
import FaqEdit from '@pages/user/board/faq/Edit';
import Qna from '@pages/user/board/qna';
import QnaDetail from '@pages/user/board/qna/Detail';
import QnaReg from '@pages/user/board/qna/Reg';
import QnaEdit from '@pages/user/board/qna/Edit';
import Dataroom from '@/pages/user/board/dataroom';
import DataroomDetail from '@/pages/user/board/dataroom/Detail';
import DataroomReg from '@/pages/user/board/dataroom/Reg';
import DataroomEdit from '@/pages/user/board/dataroom/Edit';
import InterestFeature from '@pages/user/feature/interest';
import PopularFeature from '@pages/user/feature/popular';
import SelfFeature from '@pages/user/self-feature';
import SelfFeatureDetail from '@/pages/user/self-feature/Detail';
import SelfFeatureReg from '@pages/user/self-feature/Reg';
import SelfFeatureEdit from '@pages/user/self-feature/Edit';
import SfSubmissionRequest from '@/pages/user/self-feature-submission';
import SfSubmissionRequestDetail from '@/pages/user/self-feature-submission/Detail';
import CustomerInfo from '@pages/user/customer-info/dashboard';
import Tableau from '@pages/user/tableau';
import { useFaqLoader, useQnaLoader, useFeatureLoader, useDatasetLoader } from '@/hooks/useLoader';
import PurchaseContributors from '@pages/user/structured-report/purchase-contributors';
import InternationalBoarding from '@pages/user/structured-report/international-boarding';
import DomesticBoarding from '@pages/user/structured-report/domestic-boarding';
import VipCustomerFlightStatus from '@pages/user/structured-report/vip-customer-flight-status';
import SavedMileage from '@pages/user/structured-report/saved-mileage';

const userRouter = [
  { index: true, element: <Home /> },
  {
    path: 'biz-meta',
    children: [
      {
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
    path: 'customer-info',
    children: [
      { index: true, element: <CustomerInfo /> },
      { path: 'dashboard', element: <CustomerInfo /> },
    ],
  },
  {
    path: 'structured-report',
    children: [
      { path: 'purchase-contributors', element: <PurchaseContributors /> },
      { path: 'international-boarding', element: <InternationalBoarding /> },
      { path: 'domestic-boarding', element: <DomesticBoarding /> },
      { path: 'vip-customer-flight-status', element: <VipCustomerFlightStatus /> },
      { path: 'saved-mileage', element: <SavedMileage /> },
    ],
  },
  {
    path: 'self-feature',
    children: [
      {
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
    path: 'feature',
    children: [
      { index: true, element: <InterestFeature /> },
      { path: 'interest', element: <InterestFeature /> },
      { path: 'popular', element: <PopularFeature /> },
    ],
  },
  {
    path: 'board',
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
  {
    path: 'tableau',
    children: [{ index: true, element: <Tableau /> }],
  },
  {
    path: 'popup',
    children: [{ path: 'tableau', element: <Tableau /> }],
  },
];

export default userRouter;
