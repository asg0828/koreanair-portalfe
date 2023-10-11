import { combineReducers } from '@reduxjs/toolkit';

import { menuSlice } from '@reducers/menuSlice';

const rootReducer = combineReducers({
  menu: menuSlice.reducer,
});

export default rootReducer;

export type ReducerType = ReturnType<typeof rootReducer>;
