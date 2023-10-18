const userMenuList = [
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
        name: '도움말',
        path: '/board/help',
        children: [
          { name: '도움말 등록', path: '/board/help/reg', children: [] },
          { name: '도움말 상세', path: '/board/help/detail', children: [] },
          { name: '도움말 수정', path: '/board/help/edit', children: [] },
        ],
      },
      {
        name: '자료실',
        path: '/board/archive',
        children: [
          { name: '도움말 등록', path: '/board/archive/reg', children: [] },
          { name: '도움말 상세', path: '/board/archive/detail', children: [] },
          { name: '도움말 수정', path: '/board/archive/edit', children: [] },
        ],
      },
    ],
  },
  {
    name: 'BiZ 메타',
    path: '/biz-meta',
    children: [
      {
        name: '테이블정의서',
        path: '/biz-meta/dataset',
        children: [
          { name: '테이블정의서 등록', path: '/biz-meta/dataset/reg', children: [] },
          { name: '테이블정의서 상세', path: '/biz-meta/dataset/detail', children: [] },
          { name: '테이블정의서 수정', path: '/biz-meta/dataset/edit', children: [] },
        ],
      },
      {
        name: 'Feature',
        path: '/biz-meta/feature',
        children: [
          { name: 'Feature 등록', path: '/biz-meta/feature/reg', children: [] },
          { name: 'Feature 상세', path: '/biz-meta/feature/detail', children: [] },
          { name: 'Feature 수정', path: '/biz-meta/feature/edit', children: [] },
        ],
      },
    ],
  },
  {
    name: 'Self-BI',
    path: '/self-bi',
    children: [
      {
        name: 'Tableau',
        path: '/self-bi/tableau',
        children: [],
      },
      {
        name: '보고서 (비정형)',
        path: '/self-bi/unstructured-report',
        children: [],
      },
    ],
  },
  {
    name: '보고서(정형)',
    path: '/structured-report',
    children: [
      {
        name: '정형 보고서',
        path: '/structured-report/structured-report',
        children: [],
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
    name: '고객통합정보조회',
    path: '/customer-info',
    children: [
      {
        name: '고객대시보드',
        path: '/customer-info/dashboard',
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
          { name: 'Self Feature 수정', path: '/self-feature/self-feature/edit', children: [] },],
      },
    ],
  },
];

export default userMenuList;
