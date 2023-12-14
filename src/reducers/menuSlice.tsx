import { HierarchyInfo } from '@/models/common/CommonInfo';
import { RootState } from '@/store';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface MenuState {
  isDropMenu: boolean;
  baseMenuList: Array<any>;
  menuList: Array<HierarchyInfo>;
}

const initialState: MenuState = {
  isDropMenu: false,
  baseMenuList: [],
  menuList: [],
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
  },
});

export const { setIsDropMenu, setBaseMenuList, setMenuList } = menuSlice.actions;

export const selectMenuState = (state: RootState) => state.menu;

export const selectIsDropMenu = () => createSelector([selectMenuState], (menu) => menu.isDropMenu);

export const selectBaseMenuList = () => createSelector([selectMenuState], (menu) => menu.baseMenuList);

export const selectMenuList = () => createSelector([selectMenuState], (menu) => menu.menuList);

export default menuSlice.reducer;
