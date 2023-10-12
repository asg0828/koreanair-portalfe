import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@reducers/authSlice';
import menuReducer from '@reducers/menuSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
});

export default rootReducer;
export type ReducerType = ReturnType<typeof rootReducer>;
