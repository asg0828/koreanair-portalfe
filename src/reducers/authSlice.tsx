import { createSlice } from '@reduxjs/toolkit';
import { UserInfo } from '@/models/common/User';

export interface AuthState {
  isAdminPage?: boolean;
  userInfo?: UserInfo;
}

const initialState: AuthState = {
  isAdminPage: false,
  userInfo: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state: AuthState, action) {
      state.isAdminPage = action.payload.isAdminPage;
      state.userInfo = action.payload.userInfo;
    },
    logout() {
      return initialState;
    },
  },
});

export default authSlice;
