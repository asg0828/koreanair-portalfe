const adminMenulist = [
  {
    name: 'BIZ 메타 관리',
    path: '/admin/biz-meta-management',
    children: [
      {
        name: 'Feature',
        path: '/admin/biz-meta-management/feature',
        children: [
          { name: 'Feature 등록', path: '/admin/biz-meta-management/feature/reg', children: [] },
          { name: 'Feature 상세', path: '/admin/biz-meta-management/feature/detail', children: [] },
          { name: 'Feature 수정', path: '/admin/biz-meta-management/feature/edit', children: [] },
        ],
      },
      {
        name: '테이블정의서',
        path: '/admin/biz-meta-management/dataset',
        children: [
          { name: '테이블정의서 등록', path: '/admin/biz-meta-management/dataset/reg', children: [] },
          { name: '테이블정의서 상세', path: '/admin/biz-meta-management/dataset/detail', children: [] },
          { name: '테이블정의서 수정', path: '/admin/biz-meta-management/dataset/edit', children: [] },
        ],
      },
    ],
  },
  {
    name: 'Feature 현황',
    path: '/admin/feature',
    children: [
      { name: '관심 Feature', path: '/admin/feature/interest', children: [] },
      { name: '인기 Feature', path: '/admin/feature/popular', children: [] },
    ],
  },
  {
    name: '관리자 보고서',
    path: '/admin/admin-report',
    children: [
      {
        name: 'One-ID Main',
        path: '/admin/admin-report/one-id-main',
        children: [
          {
            name: 'OneID 마스터 History',
            path: '/admin/admin-report/one-id-main/master-history',
            children: [
              { name: 'OneID 마스터 History', path: '/admin/admin-report/one-id-main/master-history', children: [] },
            ],
          },
          { name: 'OneID PAX 매핑', path: '/admin/admin-report/one-id-main/pax-mapping', children: [] },
          { name: '대리점 추정 모바일 번호', path: '/admin/admin-report/one-id-main/mobile-number', children: [] },
          {
            name: 'OneID관계이력테이블',
            path: '/admin/admin-report/one-id-main/relationship-history-table',
            children: [],
          },
        ],
      },
      { name: 'One-ID 에러 이력', path: '/admin/admin-report/one-id-error-history', children: [] },
      {
        name: 'One-ID Report',
        path: '/admin/admin-report/one-id-report',
        children: [
          {
            name: 'OneId Daily Report',
            path: '/admin/admin-report/one-id-report/daily',
            children: [{ name: 'OneId Daily Report', path: '/admin/admin-report/one-id-report/daily', children: [] }],
          },
          { name: 'OneId CTI/VOC Report', path: '/admin/admin-report/one-id-report/ctivoc', children: [] },
          { name: 'OneId SamePnrUcild Report', path: '/admin/admin-report/one-id-report/same-pnr-ucild', children: [] },
        ],
      },
      { name: '데이터 변환', path: '/admin/admin-report/data-conversion', children: [] },
    ],
  },
  {
    name: 'Self-Feature',
    path: '/admin/self-feature-meta-management',
    children: [
      {
        name: 'Customer Meta 관리',
        path: '/admin/self-feature-meta-management/customer-meta-management',
        children: [
          {
            name: 'Customer Meta 관리 상세',
            path: '/admin/self-feature-meta-management/customer-meta-management/detail',
            children: [],
          },
          {
            name: 'Customer Meta 관리 등록',
            path: '/admin/self-feature-meta-management/customer-meta-management/reg',
            children: [],
          },
        ],
      },
      {
        name: 'Master Profile 관리',
        path: '/admin/self-feature-meta-management/master-profile-management',
        children: [
          {
            name: 'Master Profile 상세',
            path: '/admin/self-feature-meta-management/master-profile-management/detail',
            children: [],
          },
          {
            name: 'Master Profile 등록',
            path: '/admin/self-feature-meta-management/master-profile-management/reg',
            children: [],
          },
          {
            name: 'Master Profile 등록',
            path: '/admin/self-feature-meta-management/master-profile-management/edit',
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: '사용자 관리',
    path: '/admin/user-management',
    children: [
      {
        name: '사용자 관리',
        path: '/admin/user-management/user-management',
        children: [{ name: '사용자 관리 상세', path: '/admin/user-management/user-management/detail', children: [] }],
      },
      {
        name: '사용자 권한그룹 관리',
        path: '/admin/user-management/user-auth-group-management',
        children: [],
      },
      {
        name: '관리자 권한그룹 관리',
        path: '/admin/user-management/admin-auth-group-management',
        children: [],
      },
      {
        name: '부서/팀 관리',
        path: '/admin/user-management/department-management',
        children: [],
      },
      {
        name: '사용자예외 관리',
        path: '/admin/user-management/user-exception-management',
        children: [],
      },
    ],
  },
  {
    name: '사용자포털 관리',
    path: '/admin/user-portal-management',
    children: [
      {
        name: '메뉴 관리',
        path: '/admin/user-portal-management/menu-management',
        children: [],
      },
      {
        name: '메뉴 권한 관리(사용자)',
        path: '/admin/user-portal-management/menu-auth-management',
        children: [],
      },
      {
        name: '게시물 관리',
        path: '/admin/user-portal-management/board-management',
        children: [
          {
            name: '공지사항',
            path: '/admin/user-portal-management/board-management/notice',
            children: [
              {
                name: '공지사항 등록',
                path: '/admin/user-portal-management/board-management/notice/reg',
                children: [],
              },
              {
                name: '공지사항 상세',
                path: '/admin/user-portal-management/board-management/notice/detail',
                children: [],
              },
              {
                name: '공지사항 수정',
                path: '/admin/user-portal-management/board-management/notice/edit',
                children: [],
              },
            ],
          },
          {
            name: 'FAQ',
            path: '/admin/user-portal-management/board-management/faq',
            children: [
              { name: 'FAQ 등록', path: '/admin/user-portal-management/board-management/faq/reg', children: [] },
              { name: 'FAQ 수정', path: '/admin/user-portal-management/board-management/faq/edit', children: [] },
            ],
          },
          {
            name: 'Q&A',
            path: '/admin/user-portal-management/board-management/qna',
            children: [
              { name: 'Q&A 등록', path: '/admin/user-portal-management/board-management/qna/reg', children: [] },
              { name: 'Q&A 상세', path: '/admin/user-portal-management/board-management/qna/detail', children: [] },
              { name: 'Q&A 수정', path: '/admin/user-portal-management/board-management/qna/edit', children: [] },
            ],
          },
          {
            name: '자료실',
            path: '/admin/user-portal-management/board-management/dataroom',
            children: [
              {
                name: '자료실 등록',
                path: '/admin/user-portal-management/board-management/dataroom/reg',
                children: [],
              },
              {
                name: '자료실 상세',
                path: '/admin/user-portal-management/board-management/dataroom/detail',
                children: [],
              },
              {
                name: '자료실 수정',
                path: '/admin/user-portal-management/board-management/dataroom/edit',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: '관리자포털 관리',
    path: '/admin/admin-portal-management',
    children: [
      {
        name: '메뉴 관리',
        path: '/admin/admin-portal-management/menu-management',
        children: [],
      },
      {
        name: '메뉴 권한 관리(관리자)',
        path: '/admin/admin-portal-management/admin-auth-management',
        children: [],
      },
    ],
  },
];

export default adminMenulist;
