const userMenuList = [
  {
    name: 'BiZ 메타',
    path: '/biz-meta',
    children: [
      {
        name: 'Feature',
        path: '/biz-meta/feature',
        children: [
          { name: 'Feature 등록', path: '/biz-meta/feature/reg', children: [] },
          { name: 'Feature 상세', path: '/biz-meta/feature/detail', children: [] },
          { name: 'Feature 수정', path: '/biz-meta/feature/edit', children: [] },
        ],
      },
      {
        name: '테이블정의서',
        path: '/biz-meta/dataset',
        children: [
          { name: '테이블정의서 등록', path: '/biz-meta/dataset/reg', children: [] },
          { name: '테이블정의서 상세', path: '/biz-meta/dataset/detail', children: [] },
          { name: '테이블정의서 수정', path: '/biz-meta/dataset/edit', children: [] },
        ],
      },
    ],
  },
  {
    name: '고객통합정보조회',
    path: '/customer-info',
    children: [
      {
        name: '고객360대시보드',
        path: '/customer-info/dashboard',
        children: [],
      },
    ],
  },
  {
    name: '보고서',
    path: '/report',
    children: [
      {
        name: '정형 보고서',
        path: '/report/structured-report',
        children: [],
      },
      {
        name: '비정형 보고서',
        path: '/report/unstructured-report',
        children: [],
      },
    ],
  },
  {
    name: 'Self Feature',
    path: '/self-feature',
    children: [
      {
        name: 'Self Feature',
        path: '/self-feature/self-feature',
        children: [
          { name: 'Self Feature 등록', path: '/self-feature/self-feature/reg', children: [] },
          { name: 'Self Feature 상세', path: '/self-feature/self-feature/detail', children: [] },
          { name: 'Self Feature 수정', path: '/self-feature/self-feature/edit', children: [] },
        ],
      },
    ],
  },
  {
    name: 'Feature 현황',
    path: '/feature',
    children: [
      { name: '관심 Feature', path: '/feature/interest', children: [] },
      { name: '인기 Feature', path: '/feature/popular', children: [] },
    ],
  },
  {
    name: '이용안내',
    path: '/board',
    children: [
      {
        name: '공지사항',
        path: '/board/notice',
        children: [
          { name: '공지사항 등록', path: '/board/notice/reg', children: [] },
          { name: '공지사항 상세', path: '/board/notice/detail', children: [] },
          { name: '공지사항 수정', path: '/board/notice/edit', children: [] },
        ],
      },
      {
        name: 'FAQ',
        path: '/board/faq',
        children: [
          { name: 'FAQ 등록', path: '/board/faq/reg', children: [] },
          { name: 'FAQ 상세', path: '/board/faq/detail', children: [] },
          { name: 'FAQ 수정', path: '/board/faq/edit', children: [] },
        ],
      },
      {
        name: 'Q&A',
        path: '/board/qna',
        children: [
          { name: 'Q&A 등록', path: '/board/qna/reg', children: [] },
          { name: 'Q&A 상세', path: '/board/qna/detail', children: [] },
          { name: 'Q&A 수정', path: '/board/qna/edit', children: [] },
        ],
      },
      {
        name: '자료실',
        path: '/board/archive',
        children: [
          { name: '자료실 등록', path: '/board/archive/reg', children: [] },
          { name: '자료실 상세', path: '/board/archive/detail', children: [] },
          { name: '자료실 수정', path: '/board/archive/edit', children: [] },
        ],
      },
    ],
  },
  {
    name: 'Tableau',
    path: '/tableau',
    isPopup: true,
    children: [],
  },
];

export default userMenuList;
