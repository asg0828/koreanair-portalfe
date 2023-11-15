import { CodeInfo } from '@/models/common/Code';
import { createSlice } from '@reduxjs/toolkit';

export interface CodeState {
  codeList: Array<CodeInfo>;
}

const initialState: CodeState = {
  codeList: [],
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCodeList(state, action) {
      state.codeList = action.payload;
    },
    addCodeList(state, action) {
      state.codeList = state.codeList.concat(action.payload);
    },
  },
});

export const { setCodeList, addCodeList } = codeSlice.actions;

export default codeSlice.reducer;
