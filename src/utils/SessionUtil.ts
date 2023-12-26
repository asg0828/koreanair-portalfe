import {
  AccessTokenRefrehTokenEnum,
  AccessTokenRefreshTokenInfo,
  Session,
  SessionInfo,
  SessionRequest,
  SessionRequestTokenEnum,
} from '@models/common/Session';

export default class SessionUtil {
  public getSessionInfo = (): SessionInfo => {
    return {
      sessionId: this.getSessionStorageValue(Session.SESSION_ID),
      apldMgrAuthId: this.getSessionStorageValue('apldMgrAuthId'),
      apldMgrAuthNm: this.getSessionStorageValue('apldMgrAuthNm'),
      apldUserAuthId: this.getSessionStorageValue('apldUserAuthId'),
      apldUserAuthNm: this.getSessionStorageValue('apldUserAuthNm'),
      deptCode: this.getSessionStorageValue('deptCode'),
      deptNm: this.getSessionStorageValue('deptNm'),
      userEmail: this.getSessionStorageValue('userEmail'),
      userId: this.getSessionStorageValue('userId'),
      userNm: this.getSessionStorageValue('userNm'),
    };
  };

  public getAccessTokenRefreshTokenInfo = (): AccessTokenRefreshTokenInfo => {
    return {
      refreshToken: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN),
      accessToken: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN),
      clientName: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME),
    };
  };

  public setSessionInfo = (sessionInfo: SessionInfo): void => {
    for (const [key, value] of Object.entries(sessionInfo)) {
      this.setSessionStorageValue(key, value ?? '');
    }
  };

  public setAccessTokenRefreshTokenInfo = (accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo): void => {
    for (const [key, value] of Object.entries(accessTokenRefreshTokenInfo)) {
      this.setSessionStorageValue(key, value ?? '');
    }
  };

  public getSessionRequestInfo = (): SessionRequest => {
    return {
      googleAccessToken: this.getSessionStorageValue(SessionRequestTokenEnum.GOOGLE_ACCESS_TOKEN),
      googleIdToken: this.getSessionStorageValue(SessionRequestTokenEnum.GOOGLE_ID_TOKEN),
    };
  };

  public getLocalSessionRequestInfo = (): SessionRequest => {
    return {
      googleAccessToken: this.getLocalStorageValue(SessionRequestTokenEnum.GOOGLE_ACCESS_TOKEN),
      googleIdToken: this.getLocalStorageValue(SessionRequestTokenEnum.GOOGLE_ID_TOKEN),
    };
  };

  public setSessionRequestInfo = (sessionRequestInfo: SessionRequest): void => {
    for (const [key, value] of Object.entries(sessionRequestInfo)) {
      this.setSessionStorageValue(key, value ?? '');
    }
  };

  public deleteSessionInfo = (): void => {
    this.deleteSessionStorage();
  };

  // public deleteAccessTokenRefreshTokenInfo = (): void => {
  //   this.deleteAccessTokenRefreshTokenStorage();
  // };

  public getSessionId = (): string => {
    return this.getSessionStorageValue(Session.SESSION_ID);
  };

  // public getRefreshToken = (): string => {
  //   return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  // };

  public getAccessToken = (): string => {
    return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN);
  };

  public getRefreshToken = (): string => {
    return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  };

  // public getClientName = (): string => {
  //   return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME);
  // };

  public setSessionId = (sessionId: string): void => {
    this.setSessionStorageValue(Session.SESSION_ID, sessionId);
  };

  public setRefreshToken = (refreshToken: string): void => {
    this.setSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN, refreshToken);
  };

  public setAccessToken = (accessToken: string): void => {
    this.setSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN, accessToken);
  };

  private getSessionStorageValue = (key: string): string => {
    /* istanbul ignore if */
    if (!key) return '';
    const value = sessionStorage.getItem(key) || '';
    return value && value !== 'undefined' ? value : '';
  };
  private setSessionStorageValue = (key: string, value: any): void => {
    /* istanbul ignore else */
    if (key) {
      sessionStorage.setItem(key, value as string);
    }
  };

  private deleteSessionStorage = (): void => {
    sessionStorage.clear();
  };

  /* google logout */
  public googleLogout = (): void => {
    this.deleteSessionInfo();

    const redirectUri: string = encodeURIComponent(process.env.REACT_APP_AUTHORIZATION_REDIRECT_URL || '');
    window.location.assign(
      'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + redirectUri
    );
  };

  /* localStorage */
  public getLocalAccessTokenRefreshTokenInfo = (): AccessTokenRefreshTokenInfo => {
    return {
      refreshToken: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN),
      accessToken: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN),
      clientName: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME),
    };
  };

  public getLocalSessionInfo = (): SessionInfo => {
    return {
      sessionId: this.getLocalStorageValue(Session.SESSION_ID),
      apldMgrAuthId: this.getLocalStorageValue('apldMgrAuthId'),
      apldMgrAuthNm: this.getLocalStorageValue('apldMgrAuthNm'),
      apldUserAuthId: this.getLocalStorageValue('apldUserAuthId'),
      apldUserAuthNm: this.getLocalStorageValue('apldUserAuthNm'),
      deptCode: this.getLocalStorageValue('deptCode'),
      deptNm: this.getLocalStorageValue('deptNm'),
      userEmail: this.getLocalStorageValue('userEmail'),
      userId: this.getLocalStorageValue('userId'),
      userNm: this.getLocalStorageValue('userNm'),
    };
  };

  public getRefreshLocalToken = (): string => {
    return this.getLocalStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  };

  public setLocalStorageInfo = (tokenInfo: any): void => {
    for (const [key, value] of Object.entries(tokenInfo)) {
      this.setLocalStorageValue(key, value ?? '');
    }
  };

  public deleteLocalStorage = (): void => {
    localStorage.clear();
  };

  private getLocalStorageValue = (key: string): string => {
    /* istanbul ignore if */
    if (!key) return '';
    const value = localStorage.getItem(key) || '';
    return value && value !== 'undefined' ? value : '';
  };

  private setLocalStorageValue = (key: string, value: any): void => {
    /* istanbul ignore else */
    if (key) {
      localStorage.setItem(key, value as string);
    }
  };
}
