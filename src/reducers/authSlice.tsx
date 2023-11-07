import { createSlice } from '@reduxjs/toolkit';
import { AuthInfo } from '@/models/common/Auth';

const initialState: AuthInfo = {
  isAdminPage: false,
  userInfo: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state: AuthInfo, action) {
      state.isAdminPage = action.payload.isAdminPage;
      state.userInfo = action.payload.userInfo;
    },
    logout(state: AuthInfo) {
      state.isAdminPage = false;
      state.userInfo = undefined;
    },
    getUserInfo(state: AuthInfo) {
      return state;
    },
  },
});

export default authSlice;
