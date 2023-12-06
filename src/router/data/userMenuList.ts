const userMenuList = [
  {
    name: 'BIZ 메타',
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
    name: '정형 보고서',
    path: '/structured-report',
    children: [
      {
        name: 'VIP고객 국제선 예약현황',
        path: '/structured-report/vip-intl-flight-reservation-status',
        children: [],
      },
      {
        name: '구매기여도 Top100',
        path: '/structured-report/purchase-contributors',
        children: [],
      },
      {
        name: '국제선 탑승횟수 Top100',
        path: '/structured-report/international-boarding',
        children: [],
      },
      {
        name: '국내선 탑승횟수 Top100',
        path: '/structured-report/domestic-boarding',
        children: [],
      },
      {
        name: '마일리지 적립 Top100',
        path: '/structured-report/saved-mileage',
        children: [],
      },
    ],
  },
  {
    name: 'Self Feature',
    path: '/self-feature',
    children: [
      {
        name: 'Feature 목록',
        path: '/self-feature/self-feature',
        children: [
          { name: 'Feature 등록', path: '/self-feature/self-feature/reg', children: [] },
          { name: 'Feature 상세', path: '/self-feature/self-feature/detail', children: [] },
          { name: 'Feature 등록', path: '/self-feature/self-feature/edit', children: [] },
        ],
      },
      {
        name: 'Feature 결재 요청 목록',
        path: '/self-feature/submission-request',
        children: [
          { name: 'Feature 결재 요청 상세', path: '/self-feature/submission-request/detail', children: [] },
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
        path: '/board/dataroom',
        children: [
          { name: '자료실 등록', path: '/board/dataroom/reg', children: [] },
          { name: '자료실 상세', path: '/board/dataroom/detail', children: [] },
          { name: '자료실 수정', path: '/board/dataroom/edit', children: [] },
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
