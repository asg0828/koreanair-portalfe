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
        name: '가상그룹 관리',
        path: '/admin/user-management/virtual-group-management',
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
        name: '권한그룹 관리',
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