import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthInfo, UserInfo } from '@/models/common/Auth';

const initialState: AuthInfo = {
  isLogin: false,
  userInfo: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state: AuthInfo) {
      state.isLogin = true;
    },
    logout(state: AuthInfo) {
      state.isLogin = false;
    },
    setUserInfo(state: AuthInfo, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
