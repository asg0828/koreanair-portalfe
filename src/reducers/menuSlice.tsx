import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuInfo, MenuItem } from '@/models/common/Menu';

const initialState: MenuInfo = {
  menuList: [],
  isDropMenu: false,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList(state: MenuInfo, action: PayloadAction<Array<MenuItem>>) {
      state.menuList = action.payload;
    },
    setIsDropMenu(state: MenuInfo, action: PayloadAction<boolean>) {
      state.isDropMenu = action.payload;
    },
  },
});
export default menuSlice;
