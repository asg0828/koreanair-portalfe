import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from '@components/layout';
import Home from '@pages/Home';
import Test from '@pages/Test';
import Error from '@pages/Error';
import DataSet from '@pages/biz-meta/dataset';
import DataSetDetail from '@pages/biz-meta/dataset/Detail';
import DataSetReg from '@pages/biz-meta/dataset/Reg';
import DataSetEdit from '@pages/biz-meta/dataset/Edit';
import Feature from '@pages/biz-meta/feature';
import FeatureDetail from '@pages/biz-meta/feature/Detail';
import FeatureReg from '@pages/biz-meta/feature/Reg';
import FeatureEdit from '@pages/biz-meta/feature/Edit';
import Notice from '@pages/board/notice';
import NoticeDetail from '@pages/board/notice/Detail';
import NoticeReg from '@pages/board/notice/Reg';
import NoticeEdit from '@pages/board/notice/Edit';
import Faq from '@pages/board/faq';
import FaqDetail from '@pages/board/faq/Detail';
import FaqReg from '@pages/board/faq/Reg';
import FaqEdit from '@pages/board/faq/Edit';
import Qna from '@pages/board/qna';
import QnaDetail from '@pages/board/qna/Detail';
import QnaReg from '@pages/board/qna/Reg';
import QnaEdit from '@pages/board/qna/Edit';
import Help from '@pages/board/help';
import HelpDetail from '@pages/board/help/Detail';
import HelpReg from '@pages/board/help/Reg';
import HelpEdit from '@pages/board/help/Edit';
import Archive from '@pages/board/archive';
import ArchiveDetail from '@pages/board/archive/Detail';
import ArchiveReg from '@pages/board/archive/Reg';
import ArchiveEdit from '@pages/board/archive/Edit';
import InterestFeature from '@pages/feature/interest';
import PopularFeature from '@pages/feature/popular';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { path: 'home', element: <Home /> },
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
            path: 'help',
            children: [
              { index: true, element: <Help /> },
              { path: 'detail', element: <HelpDetail /> },
              { path: 'reg', element: <HelpReg /> },
              { path: 'edit', element: <HelpEdit /> },
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
        path: 'biz-meta',
        children: [
          {
            path: 'dataset',
            children: [
              { index: true, element: <DataSet /> },
              { path: 'detail', element: <DataSetDetail /> },
              { path: 'reg', element: <DataSetReg /> },
              { path: 'edit', element: <DataSetEdit /> },
            ],
          },
          {
            path: 'feature',
            children: [
              { index: true, element: <Feature /> },
              { path: 'detail', element: <FeatureDetail /> },
              { path: 'reg', element: <FeatureReg /> },
              { path: 'edit', element: <FeatureEdit /> },
            ],
          },
        ],
      },
      {
        path: 'self-bi',
        children: [
          { index: true, element: <Test /> },
          { path: 'tableau', element: <Test /> },
          { path: 'unstructured-report', element: <Test /> },
        ],
      },
      {
        path: 'structured-report',
        children: [
          { index: true, element: <Test /> },
          { path: 'structured-report', element: <Test /> },
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
        path: 'customer-info',
        children: [
          { index: true, element: <Test /> },
          { path: 'dashboard', element: <Test /> },
        ],
      },
      {
        path: 'self-feature',
        children: [
          { index: true, element: <Test /> },
          { path: 'self-feature', element: <Test /> },
        ],
      },
    ],
  },
]);

const Route = () => {
  return <RouterProvider router={router} />;
};
export default Route;
