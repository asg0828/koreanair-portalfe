import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@reducers/authSlice';
import menuSlice from '@reducers/menuSlice';
import modalSlice from '@reducers/modalSlice';
import codeSlice from '@reducers/codeSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    menu: menuSlice,
    modal: modalSlice,
    code: codeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
