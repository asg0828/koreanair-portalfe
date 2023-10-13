export interface AuthInfo {
  isAdminPage: boolean;
  userInfo?: UserInfo;
}

export interface UserInfo {
  userId?: string;
  userNm?: string;
  pstnCode?: string;
  detpCode?: string;
  authId?: string;
  isAdmin?: boolean;
}
