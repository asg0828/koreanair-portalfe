import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CodeInfo } from '@/models/common/Code';

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
    setCodeList(state, action: PayloadAction<Array<CodeInfo>>) {
      state.codeList = action.payload;
    },
    addCodeList(state, action: PayloadAction<Array<CodeInfo>>) {
      state.codeList = state.codeList.concat(action.payload);
    },
  },
});

export default codeSlice;
