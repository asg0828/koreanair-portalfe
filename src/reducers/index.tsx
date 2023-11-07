import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '@reducers/authSlice';
import menuSlice from '@reducers/menuSlice';
import modalSlice from './modalSlice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  menu: menuSlice.reducer,
  modal: modalSlice.reducer,
});

export default rootReducer;
export type ReducerType = ReturnType<typeof rootReducer>;

export { authSlice, menuSlice, modalSlice };
