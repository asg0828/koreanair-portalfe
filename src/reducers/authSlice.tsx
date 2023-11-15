import { UserInfo } from '@/models/common/User';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isAdminPage?: boolean;
  userInfo?: UserInfo;
  contextPath: string;
}

const initialState: AuthState = {
  isAdminPage: false,
  userInfo: undefined,
  contextPath: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.userInfo = action.payload.userInfo;
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

export default authSlice.reducer;
