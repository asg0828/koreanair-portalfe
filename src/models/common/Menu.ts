import { MenuInfo } from '@/models/common/CommonInfo';

export const defaultPath: any = {
  '/biz-meta': '/biz-meta/feature',
  '/customer-info': '/customer-info/dashboard',
  '/structured-report': '/structured-report/vip-intl-flight-reservation-status',
  '/self-feature': '/self-feature/self-feature',
  '/feature': '/feature/interest',
  '/board': '/board/notice',
  '/admin/biz-meta-management': '/admin/biz-meta-management/feature',
  '/admin/admin-report': '/admin/admin-report/one-id-main',
  '/admin/admin-report/one-id-main': '/admin/admin-report/one-id-main/master-history',
  '/admin/admin-report/one-id-report': '/admin/admin-report/one-id-report/daily',
  '/admin/user-management': '/admin/user-management/user-management',
  '/admin/user-portal-management': '/admin/user-portal-management/menu-management',
  '/admin/user-portal-management/board-management': '/admin/user-portal-management/board-management/notice',
  '/admin/admin-portal-management': '/admin/admin-portal-management/menu-management',
  '/admin/self-feature-meta-management': '/admin/self-feature-meta-management/customer-meta-management',
};

export const userMenuList: Array<MenuInfo> = [
  { menuNm: 'BIZ 메타', menuUrl: '/biz-meta' },
  { menuNm: 'Feature', menuUrl: '/biz-meta/feature' },
  { menuNm: 'Feature 등록', menuUrl: '/biz-meta/feature/reg', isCrudPage: true },
  { menuNm: 'Feature 상세', menuUrl: '/biz-meta/feature/detail', isCrudPage: true },
  { menuNm: 'Feature 수정', menuUrl: '/biz-meta/feature/edit', isCrudPage: true },
  { menuNm: '테이블정의서', menuUrl: '/biz-meta/dataset' },
  { menuNm: '테이블정의서 등록', menuUrl: '/biz-meta/dataset/reg', isCrudPage: true },
  { menuNm: '테이블정의서 상세', menuUrl: '/biz-meta/dataset/detail', isCrudPage: true },
  { menuNm: '테이블정의서 수정', menuUrl: '/biz-meta/dataset/edit', isCrudPage: true },
  { menuNm: '고객통합정보조회', menuUrl: '/customer-info' },
  { menuNm: '고객360대시보드', menuUrl: '/customer-info/dashboard' },
  { menuNm: '실적정보', menuUrl: '/structured-report' },
  { menuNm: 'VIP고객 국제선 예약현황', menuUrl: '/structured-report/vip-intl-flight-reservation-status' },
  { menuNm: '구매기여도 Top100', menuUrl: '/structured-report/purchase-contributors' },
  { menuNm: '국제선 탑승횟수 Top100', menuUrl: '/structured-report/international-boarding' },
  { menuNm: '국내선 탑승횟수 Top100', menuUrl: '/structured-report/domestic-boarding' },
  { menuNm: '마일리지 적립 Top100', menuUrl: '/structured-report/saved-mileage' },
  { menuNm: '보너스항공권 탑승 Top100', menuUrl: '/structured-report/award-ticket-boarding' },
  { menuNm: '국제선 마일리지 Upgrade 탑승 Top100', menuUrl: '/structured-report/intl-mileage-upgrade-boarding' },
  { menuNm: 'Self Feature', menuUrl: '/self-feature' },
  { menuNm: 'Feature 목록', menuUrl: '/self-feature/self-feature' },
  { menuNm: 'Feature 등록', menuUrl: '/self-feature/self-feature/reg', isCrudPage: true },
  { menuNm: 'Feature 상세', menuUrl: '/self-feature/self-feature/detail', isCrudPage: true },
  { menuNm: 'Feature 결재 요청 목록', menuUrl: '/self-feature/submission-request' },
  { menuNm: 'Feature 결재 요청 상세', menuUrl: '/self-feature/submission-request/detail', isCrudPage: true },
  { menuNm: 'Feature 현황', menuUrl: '/feature' },
  { menuNm: '관심 Feature', menuUrl: '/feature/interest' },
  { menuNm: '인기 Feature', menuUrl: '/feature/popular' },
  { menuNm: '이용안내', menuUrl: '/board' },
  { menuNm: '공지사항', menuUrl: '/board/notice' },
  { menuNm: '공지사항 등록', menuUrl: '/board/notice/reg', isCrudPage: true },
  { menuNm: '공지사항 상세', menuUrl: '/board/notice/detail', isCrudPage: true },
  { menuNm: '공지사항 수정', menuUrl: '/board/notice/edit', isCrudPage: true },
  { menuNm: 'FAQ', menuUrl: '/board/faq' },
  { menuNm: 'FAQ 등록', menuUrl: '/board/faq/reg', isCrudPage: true },
  { menuNm: 'FAQ 수정', menuUrl: '/board/faq/edit', isCrudPage: true },
  { menuNm: 'Q&A', menuUrl: '/board/qna' },
  { menuNm: 'Q&A 등록', menuUrl: '/board/qna/reg', isCrudPage: true },
  { menuNm: 'Q&A 상세', menuUrl: '/board/qna/detail', isCrudPage: true },
  { menuNm: 'Q&A 수정', menuUrl: '/board/qna/edit', isCrudPage: true },
  { menuNm: '자료실', menuUrl: '/board/dataroom' },
  { menuNm: '자료실 등록', menuUrl: '/board/dataroom/reg', isCrudPage: true },
  { menuNm: '자료실 상세', menuUrl: '/board/dataroom/detail', isCrudPage: true },
  { menuNm: '자료실 수정', menuUrl: '/board/dataroom/edit', isCrudPage: true },
  { menuNm: 'Tableau', menuUrl: '/popup/tableau' },
];

export const adminMenulist: Array<MenuInfo> = [
  { menuNm: 'BIZ 메타', menuUrl: '/admin/biz-meta-management' },
  { menuNm: 'Feature', menuUrl: '/admin/biz-meta-management/feature' },
  { menuNm: 'Feature 등록', menuUrl: '/admin/biz-meta-management/feature/reg', isCrudPage: true },
  { menuNm: 'Feature 상세', menuUrl: '/admin/biz-meta-management/feature/detail', isCrudPage: true },
  { menuNm: 'Feature 수정', menuUrl: '/admin/biz-meta-management/feature/edit', isCrudPage: true },
  { menuNm: '테이블정의서', menuUrl: '/admin/biz-meta-management/dataset' },
  { menuNm: '테이블정의서 등록', menuUrl: '/admin/biz-meta-management/dataset/reg', isCrudPage: true },
  { menuNm: '테이블정의서 상세', menuUrl: '/admin/biz-meta-management/dataset/detail', isCrudPage: true },
  { menuNm: '테이블정의서 수정', menuUrl: '/admin/biz-meta-management/dataset/edit', isCrudPage: true },
  { menuNm: 'Feature 현황', menuUrl: '/admin/feature' },
  { menuNm: '관심 Feature', menuUrl: '/admin/feature/interest' },
  { menuNm: '인기 Feature', menuUrl: '/admin/feature/popular' },
  { menuNm: '관리자 보고서', menuUrl: '/admin/admin-report' },
  { menuNm: 'One-ID Main', menuUrl: '/admin/admin-report/one-id-main' },
  { menuNm: 'OneID 마스터 History', menuUrl: '/admin/admin-report/one-id-main/master-history' },
  { menuNm: 'OneID PAX 매핑', menuUrl: '/admin/admin-report/one-id-main/pax-mapping' },
  { menuNm: '대리점 추정 모바일 번호', menuUrl: '/admin/admin-report/one-id-main/mobile-number' },
  { menuNm: 'OneID관계이력테이블', menuUrl: '/admin/admin-report/one-id-main/relationship-history-table' },
  { menuNm: 'One-ID 에러 이력', menuUrl: '/admin/admin-report/one-id-error-history' },
  { menuNm: 'One-ID Report', menuUrl: '/admin/admin-report/one-id-report' },
  { menuNm: 'OneId Daily Report', menuUrl: '/admin/admin-report/one-id-report/daily' },
  { menuNm: 'OneId CTI/VOC Report', menuUrl: '/admin/admin-report/one-id-report/ctivoc' },
  { menuNm: 'OneId SamePnrUcild Report', menuUrl: '/admin/admin-report/one-id-report/same-pnr-ucild' },
  { menuNm: '데이터 변환', menuUrl: '/admin/admin-report/data-conversion' },
  { menuNm: 'Self-Feature', menuUrl: '/admin/self-feature-meta-management' },
  { menuNm: 'Customer Meta 관리', menuUrl: '/admin/self-feature-meta-management/customer-meta-management' },
  {
    menuNm: 'Customer Meta 관리 상세',
    menuUrl: '/admin/self-feature-meta-management/customer-meta-management/detail',
    isCrudPage: true,
  },
  {
    menuNm: 'Customer Meta 관리 등록',
    menuUrl: '/admin/self-feature-meta-management/customer-meta-management/reg',
    isCrudPage: true,
  },
  { menuNm: 'Master Profile 관리', menuUrl: '/admin/self-feature-meta-management/master-profile-management' },
  {
    menuNm: 'Master Profile 상세',
    menuUrl: '/admin/self-feature-meta-management/master-profile-management/detail',
    isCrudPage: true,
  },
  {
    menuNm: 'Master Profile 등록',
    menuUrl: '/admin/self-feature-meta-management/master-profile-management/reg',
    isCrudPage: true,
  },
  {
    menuNm: 'Master Profile 등록',
    menuUrl: '/admin/self-feature-meta-management/master-profile-management/edit',
    isCrudPage: true,
  },
  { menuNm: '사용자 관리', menuUrl: '/admin/user-management' },
  { menuNm: '사용자 관리', menuUrl: '/admin/user-management/user-management' },
  { menuNm: '사용자 권한그룹 관리', menuUrl: '/admin/user-management/user-auth-group-management' },
  { menuNm: '관리자 권한그룹 관리', menuUrl: '/admin/user-management/admin-auth-group-management' },
  { menuNm: '부서/팀 관리', menuUrl: '/admin/user-management/department-management' },
  { menuNm: '사용자예외 관리', menuUrl: '/admin/user-management/user-exception-management' },
  { menuNm: '사용자포털 관리', menuUrl: '/admin/user-portal-management' },
  { menuNm: '메뉴 관리', menuUrl: '/admin/user-portal-management/menu-management' },
  { menuNm: '메뉴 권한 관리(사용자)', menuUrl: '/admin/user-portal-management/menu-auth-management' },
  { menuNm: '게시물 관리', menuUrl: '/admin/user-portal-management/board-management' },
  { menuNm: '공지사항', menuUrl: '/admin/user-portal-management/board-management/notice' },
  { menuNm: '공지사항 등록', menuUrl: '/admin/user-portal-management/board-management/notice/reg', isCrudPage: true },
  {
    menuNm: '공지사항 상세',
    menuUrl: '/admin/user-portal-management/board-management/notice/detail',
    isCrudPage: true,
  },
  { menuNm: '공지사항 수정', menuUrl: '/admin/user-portal-management/board-management/notice/edit', isCrudPage: true },
  { menuNm: 'FAQ', menuUrl: '/admin/user-portal-management/board-management/faq' },
  { menuNm: 'FAQ 등록', menuUrl: '/admin/user-portal-management/board-management/faq/reg', isCrudPage: true },
  { menuNm: 'FAQ 수정', menuUrl: '/admin/user-portal-management/board-management/faq/edit', isCrudPage: true },
  { menuNm: 'Q&A', menuUrl: '/admin/user-portal-management/board-management/qna' },
  { menuNm: 'Q&A 등록', menuUrl: '/admin/user-portal-management/board-management/qna/reg', isCrudPage: true },
  { menuNm: 'Q&A 상세', menuUrl: '/admin/user-portal-management/board-management/qna/detail', isCrudPage: true },
  { menuNm: 'Q&A 수정', menuUrl: '/admin/user-portal-management/board-management/qna/edit', isCrudPage: true },
  { menuNm: '자료실', menuUrl: '/admin/user-portal-management/board-management/dataroom' },
  { menuNm: '자료실 등록', menuUrl: '/admin/user-portal-management/board-management/dataroom/reg', isCrudPage: true },
  {
    menuNm: '자료실 상세',
    menuUrl: '/admin/user-portal-management/board-management/dataroom/detail',
    isCrudPage: true,
  },
  { menuNm: '자료실 수정', menuUrl: '/admin/user-portal-management/board-management/dataroom/edit', isCrudPage: true },
  { menuNm: '관리자포털 관리', menuUrl: '/admin/admin-portal-management' },
  { menuNm: '메뉴 관리', menuUrl: '/admin/admin-portal-management/menu-management' },
  { menuNm: '메뉴 권한 관리(관리자)', menuUrl: '/admin/admin-portal-management/admin-auth-management' },
];
