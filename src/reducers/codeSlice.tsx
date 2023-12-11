import { getCodeList } from '@/api/CodeAPI';
import { CodeModel } from '@/models/model/CodeModel';
import store, { RootState } from '@/store';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface CodeState {
  codeList: Array<CodeModel>;
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

export const selectCodeState = (state: RootState) => state.code;

export const selectCodeList = (groupId: string) =>
  createSelector([selectCodeState], (code) => code.codeList.filter((codeItem) => codeItem.groupId === groupId));

export const selectCode = (groupId: string, codeId: string) => {
  createSelector([selectCodeState], (code) =>
    code.codeList.find((codeItem) => codeItem.groupId === groupId && codeItem.codeId === codeId)
  );
};

export const getCode = (groupId: string, codeId: string) =>
  store.getState().code.codeList.find((codeItem) => codeItem.groupId === groupId && codeItem.codeId === codeId);

export const getCodeListWithOut = async (groupId: string): Promise<any> => {
  const filterCodeList = store.getState().code.codeList.filter((codeItem) => codeItem.groupId === groupId);

  if (filterCodeList.length === 0) {
    const response = await getCodeList(groupId);

    if (response.successOrNot === 'N') {
    } else {
      store.dispatch(codeSlice.actions.addCodeList(response.data));
    }
  }

  return true;
};

export default codeSlice.reducer;
