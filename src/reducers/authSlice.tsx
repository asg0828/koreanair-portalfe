import { SessionInfo } from '@/models/common/Session';
import { RootState } from '@/store';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  sessionInfo: SessionInfo;
  contextPath: string;
}

const initialState: AuthState = {
  sessionInfo: {
    sessionId: '',
    memberId: null,
    employeeNumber: '',
    memberName: '',
    email: '',
    languageCode: '',
    roleType: '',
    memberStateCode: '',
    apldMgrAuthId: '', // string
    apldMgrAuthNm: '', // string
    apldUserAuthId: '', // string
    apldUserAuthNm: '', // string
    deptCode: '', // string
    deptNm: '', // string
    menuByAuthMgr: {
      menus: [],
      search: {
        authId: '',
        authNm: '',
      },
    }, // MenuByAuthMgrUser
    menuByAuthUser: {
      menus: [],
      search: {
        authId: '',
        authNm: '',
      },
    }, // MenuByAuthMgrUser
    userEmail: '', // string
    userId: '', // string
    userNm: '', // string
  },
  contextPath: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.sessionInfo = action.payload;
    },
    logout() {
      return initialState;
    },
    setContextPath(state, action) {
      state.contextPath = action.payload;
    },
  },
});

export const { login, logout, setContextPath } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;

export const selectSessionInfo = () => createSelector([selectAuthState], (auth) => auth.sessionInfo);

export const selectContextPath = () => createSelector([selectAuthState], (auth) => auth.contextPath);

export default authSlice.reducer;
