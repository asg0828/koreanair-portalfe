import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReducerType } from '@reducers';
import MainNavigation from '@components/layout/MainNavigation';
import { Stack, Typography } from '@components/ui';
import { MenuItem } from '@models/common/Menu';
import { StarBorderIcon } from '@/assets/icons';
import './Main.scss';

const Main = () => {
  const location = useLocation();
  const menuList = useSelector((state: ReducerType) => state.menu.menuList)!;

  const getMenuRecursive = (menuList: MenuItem[]): MenuItem | undefined => {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].path === location.pathname) {
        return menuList[i];
      } else {
        if (menuList[i].children) {
          const menuObj = getMenuRecursive(menuList[i].children);

          if (menuObj) {
            return menuObj;
          }
        }
      }
    }
  };

  const menuObj = getMenuRecursive(menuList);
  const title = menuObj ? menuObj.name : 'UnKown Title';

  return (
    <main id="main" className="width-100">
      <Stack direction="Vertical" gap="MD" className="height-100">
        <MainNavigation />

        <Stack className="width-100" gap="MD">
          <Typography>{title}</Typography>
          <StarBorderIcon  />
        </Stack>

        <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
          <Outlet />
        </Stack>
      </Stack>
    </main>
  );
};
export default Main;
