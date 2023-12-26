import { HierarchyInfo } from '@/models/common/CommonInfo';
import { RootState } from '@/store';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface MenuState {
  isDropMenu: boolean;
  baseMenuList: Array<any>;
  menuList: Array<HierarchyInfo>;
  quickMenuList: Array<any>;
  cLevelModal: boolean;
}

const initialState: MenuState = {
  isDropMenu: false,
  baseMenuList: [],
  menuList: [],
  quickMenuList: [],
  cLevelModal: false,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setIsDropMenu(state: MenuState, action) {
      state.isDropMenu = action.payload;
    },
    setBaseMenuList(state: MenuState, action) {
      state.baseMenuList = action.payload;
    },
    setMenuList(state: MenuState, action) {
      state.menuList = action.payload;
    },
    setQuickMenuList(state: MenuState, action) {
      state.quickMenuList = action.payload;
    },
    setCLevelModal(state: MenuState, action) {
      state.cLevelModal = action.payload;
    },
  },
});

export const { setIsDropMenu, setBaseMenuList, setMenuList, setQuickMenuList, setCLevelModal } = menuSlice.actions;

export const selectMenuState = (state: RootState) => state.menu;

export const selectIsDropMenu = () => createSelector([selectMenuState], (menu) => menu.isDropMenu);

export const selectBaseMenuList = () => createSelector([selectMenuState], (menu) => menu.baseMenuList);

export const selectMenuList = () => createSelector([selectMenuState], (menu) => menu.menuList);

export const selectQuickMenuList = () => createSelector([selectMenuState], (menu) => menu.quickMenuList);

export const selectCLevelModal = () => createSelector([selectMenuState], (menu) => menu.cLevelModal);
export default menuSlice.reducer;
