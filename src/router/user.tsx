import RootLayout from '@components/layout';
import Error from '@/pages/Error';
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
import InterestFeature from '@pages/user/feature/interest';
import PopularFeature from '@pages/user/feature/popular';
import SelfFeature from '@pages/user/self-feature';
import SelfFeatureDetail from '@/pages/user/self-feature/Detail';
import SelfFeatureReg from '@pages/user/self-feature/Reg';
import SelfFeatureEdit from '@pages/user/self-feature/Edit';
import CustomerInfo from '@pages/user/customer-info/dashboard';
import StructuredReport from '@pages/user/report/structured-report';
import UnStructuredReport from '@pages/user/report/unstructured-report';
import Tableau from '@pages/user/tableau';

const userRouter = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'biz-meta',
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
        path: 'customer-info',
        children: [
          { index: true, element: <CustomerInfo /> },
          { path: 'dashboard', element: <CustomerInfo /> },
        ],
      },
      {
        path: 'report',
        children: [
          { index: true, element: <StructuredReport /> },
          { path: 'structured-report', element: <StructuredReport /> },
          { path: 'unstructured-report', element: <UnStructuredReport /> },
        ],
      },
      {
        path: 'self-feature',
        children: [
          { index: true, element: <SelfFeature /> },
          {
            path: 'self-feature',
            children: [
              { index: true, element: <SelfFeature /> },
              { path: 'detail', element: <SelfFeatureDetail /> },
              { path: 'reg', element: <SelfFeatureReg /> },
              { path: 'edit', element: <SelfFeatureEdit /> },
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
      {
        path: 'tableau',
        children: [{ index: true, element: <Tableau /> }],
      },
      {
        path: 'popup',
        children: [{ path: 'tableau', element: <Tableau /> }],
      },
    ],
  },
];

export default userRouter;
