export interface SessionInfo {
  sessionId?: string;
  memberId?: number | null;
  memberName?: string;
  email?: string;
  languageCode?: string;
  roleType?: string;
  memberStateCode?: string;
}

export interface AccessTokenRefreshTokenInfo {
  refreshToken?: string | '';
  accessToken?: string | '';
  clientName?: string | '';
}

export enum Session {
  SESSION_ID = 'sessionId',
}

export enum AccessTokenRefrehTokenEnum {
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN = 'accessToken',
  CLIENT_NAME = 'clientName',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthLoginRequest {
  redirect_uri: string | '';
  client_id: string | '';
}

export interface AccessTokenRefreshTokenRequest {
  code: string | '';
}

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
}
