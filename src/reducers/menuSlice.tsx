import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuInfo, MenuItem } from '@/models/common/Menu';

const initialState: MenuInfo = {
  menuList: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList(state: MenuInfo, action: PayloadAction<Array<MenuItem>>) {
      state.menuList = action.payload;
    },
  },
});
export default menuSlice;
