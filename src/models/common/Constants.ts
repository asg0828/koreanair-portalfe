export enum View {
  DETAIL = 'detail',
  REG = 'reg',
  EDIT = 'edit',
}

export enum ValidType {
  DEFAULT = 'Default',
  CONFIRM = 'Confirm',
  ERROR = 'Error',
  INFO = 'Info',
}

export enum ModalType {
  NORMAL = 'NORMAL',
  CONFIRM = 'CONFIRM',
  NOTICE = 'NOTICE',
  CALCULATION_LOGIC = 'CALCULATION_LOGIC',
  USER_SELECT = 'USER_SELECT',
  DEPT_SELECT = 'DEPT_SELECT',
}

export enum GroupCodeType {
  FAQ_TYPE = 'FAQ_TYPE',
  QNA_TYPE = 'QNA_TYPE',
  QNA_STAT = 'QNA_STAT',
  FEATURE_TYPE = 'FEATURE_TYPE',
  DBMS = 'DBMS',
}

export enum ContextPath {
  USER = '',
  ADMIN = '/admin',
  TEST = '/test',
  POPUP = '/popup',
  ADMIN_POPUP = '/admin/popup',
}

export enum MainLink {
  NOTICE = '/board/notice',
  FAQ = '/board/faq',
  QNA = '/board/qna',
  FEATURE = '/biz-meta/feature',
  POPULAR_FEATURE = '/feature/popular',
}

export enum AdminMainLink {
  NOTICE = '/admin/user-portal-management/board-management/notice',
  FAQ = '/admin/user-portal-management/board-management/faq',
  QNA = '/admin/user-portal-management/board-management/qna',
  FEATURE = '/admin/biz-meta-management/feature',
  POPULAR_FEATURE = '/admin/feature/popular',
}

export const menuIconSx = {
  width: 30,
};

export const folderSx = {
  width: 30,
  color: 'rgb(250 200 1);',
};

export const fileSx = {
  color: '#777777',
};
