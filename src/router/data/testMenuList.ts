const testMenulist = [
  {
    name: '테스트 관리',
    path: '/test',
    children: [
      {
        name: 'API 테스트',
        path: '/test/api',
        children: [],
      },
      {
        name: 'MODAL 테스트',
        path: '/test/modal',
        children: [],
      },
      {
        name: '인증 테스트',
        path: '/test/auth',
        children: [],
      },
      {
        name: '훅 테스트',
        path: '/test/hook',
        children: [],
      },
    ],
  },
];

export default testMenulist;
