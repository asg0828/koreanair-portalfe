import { ContextPath } from '@/models/common/Constants';
import { SessionInfo } from '@/models/common/Session';
import { RootState } from '@/store';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  contextPath: string;
  sessionInfo: SessionInfo;
}

const initialState: AuthState = {
  contextPath: ContextPath.UNAUTHORIZED,
  sessionInfo: {
    sessionId: '',
    apldMgrAuthId: '',
    apldMgrAuthNm: '',
    apldUserAuthId: '',
    apldUserAuthNm: '',
    deptCode: '',
    deptNm: '',
    menuByAuthMgr: {
      menus: [],
      search: {
        authId: '',
        authNm: '',
      },
    },
    menuByAuthUser: {
      menus: [],
      search: {
        authId: '',
        authNm: '',
      },
    },
    userEmail: '',
    userId: '',
    userNm: '',
  },
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
