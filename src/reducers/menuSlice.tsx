import { MenuItem } from '@/models/common/Menu';
import { RootState } from '@/store';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface MenuState {
  menuList: Array<MenuItem>;
  isDropMenu: boolean;
}

const initialState: MenuState = {
  menuList: [],
  isDropMenu: false,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList(state: MenuState, action) {
      state.menuList = action.payload;
    },
    setIsDropMenu(state: MenuState, action) {
      state.isDropMenu = action.payload;
    },
  },
});

export const { setMenuList, setIsDropMenu } = menuSlice.actions;

export const selectMenuState = (state: RootState) => state.menu;

export const selectMenuList = () => createSelector([selectMenuState], (menu) => menu.menuList);

export const selectIsDropMenu = () => createSelector([selectMenuState], (menu) => menu.isDropMenu);

export default menuSlice.reducer;
