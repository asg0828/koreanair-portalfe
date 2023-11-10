import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '@reducers/authSlice';
import menuSlice from '@reducers/menuSlice';
import modalSlice from '@reducers/modalSlice';
import codeSlice from '@reducers/codeSlice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  menu: menuSlice.reducer,
  modal: modalSlice.reducer,
  code: codeSlice.reducer,
});

export default rootReducer;
export type ReducerType = ReturnType<typeof rootReducer>;

export { authSlice, menuSlice, modalSlice, codeSlice };
