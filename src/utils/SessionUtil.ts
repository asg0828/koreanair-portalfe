import { SessionInfo, Session, AccessTokenRefreshTokenInfo, AccessTokenRefrehTokenEnum } from '@models/common/Session';

export default class SessionUtil {
  public getSessionInfo = (): SessionInfo => {
    let sessionInfo: SessionInfo = {} as SessionInfo;

    sessionInfo = {
      sessionId: this.getSessionStorageValue(Session.SESSION_ID),
      memberId: this.getSessionStorageValue('memberId') !== '' ? Number(this.getSessionStorageValue('memberId')) : null,
      memberName: this.getSessionStorageValue('memberName'),
      email: this.getSessionStorageValue('email'),
      languageCode: this.getSessionStorageValue('languageCode'),
      roleType: this.getSessionStorageValue('roleType'),
      memberStateCode: this.getSessionStorageValue('memberStateCode'),
    };

    return sessionInfo;
  };

  public getAccessTokenRefreshTokenInfo = (): AccessTokenRefreshTokenInfo => {
    let accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo = {} as AccessTokenRefreshTokenInfo;

    accessTokenRefreshTokenInfo = {
      refreshToken: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN),
      accessToken: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN),
      clientName: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME),
    };

    return accessTokenRefreshTokenInfo;
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

  // public setRefreshToken = (refreshToken: string): void => {
  //   this.setSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN, refreshToken);
  // };

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

  /* localStorage */
  public getLocalAccessTokenRefreshTokenInfo = (): AccessTokenRefreshTokenInfo => {
    let accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo = {} as AccessTokenRefreshTokenInfo;

    accessTokenRefreshTokenInfo = {
      refreshToken: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN),
      accessToken: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN),
      clientName: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME),
    };

    return accessTokenRefreshTokenInfo;
  };

  public getRefreshLocalToken = (): string => {
    return this.getLocalStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  };

  public setLocalStorageInfo = (accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo): void => {
    for (const [key, value] of Object.entries(accessTokenRefreshTokenInfo)) {
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
