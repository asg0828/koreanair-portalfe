const adminMenulist = [
  {
    name: '사용자 관리',
    path: '/admin/user-management',
    children: [
      {
        name: '사용자 관리',
        path: '/admin/user-management/user-management',
        children: [
          { name: '사용자 관리 상세', path: '/admin/user-management/user-management/detail', children: [] },
        ],
      },
      {
        name: '권한그룹 관리',
        path: '/admin/user-management/auth-group-management',
        children: [],
      },
      {
        name: '부서 관리',
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
        name: '메뉴권한 관리',
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
              { name: '공지사항 등록', path: '/admin/user-portal-management/board-management/notice/reg', children: [] },
              { name: '공지사항 상세', path: '/admin/user-portal-management/board-management/notice/detail', children: [] },
              { name: '공지사항 수정', path: '/admin/user-portal-management/board-management/notice/edit', children: [] },
            ],
          },
          {
            name: 'FAQ',
            path: '/admin/user-portal-management/board-management/faq',
            children: [
              { name: 'FAQ 등록', path: '/admin/user-portal-management/board-management/faq/reg', children: [] },
              { name: 'FAQ 상세', path: '/admin/user-portal-management/board-management/faq/detail', children: [] },
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
            path: '/admin/user-portal-management/board-management/archive',
            children: [
              { name: '도움말 등록', path: '/admin/user-portal-management/board-management/archive/reg', children: [] },
              { name: '도움말 상세', path: '/admin/user-portal-management/board-management/archive/detail', children: [] },
              { name: '도움말 수정', path: '/admin/user-portal-management/board-management/archive/edit', children: [] },
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
        name: '권한그룹 관리 (관리자)',
        path: '/admin/admin-portal-management/auth-group-management',
        children: [],
      },
      {
        name: '관리자권한 관리',
        path: '/admin/admin-portal-management/admin-auth-management',
        children: [],
      },
    ],
  },
];

export default adminMenulist;