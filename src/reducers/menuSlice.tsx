import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/models/common/Menu';

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
    setMenuList(state: MenuState, action: PayloadAction<Array<MenuItem>>) {
      state.menuList = action.payload;
    },
    setIsDropMenu(state: MenuState, action: PayloadAction<boolean>) {
      state.isDropMenu = action.payload;
    },
  },
});

export default menuSlice;
