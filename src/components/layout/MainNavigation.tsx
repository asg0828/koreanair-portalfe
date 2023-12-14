import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { selectMenuList } from '@/reducers/menuSlice';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Stack } from '@components/ui';
import { useLocation, useNavigate } from 'react-router-dom';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuUrlNames = location.pathname.split('/').filter((menuUrl) => menuUrl);
  const menuList = useAppSelector(selectMenuList())!;
  const contextPath = useAppSelector(selectContextPath());

  const getMenuRecursive = (menuList: any[], menuUrl: string): any | undefined => {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].menuUrl === menuUrl || menuList[i].menuUrl === '*') {
        return menuList[i];
      } else {
        if (menuList[i].children) {
          const menuObj = getMenuRecursive(menuList[i].children, menuUrl);

          if (menuObj) {
            return menuObj;
          }
        }
      }
    }
  };

  const getMenuInfo = (index: number): Array<string> => {
    let menuUrl = '';

    for (let i = 0; i <= index; i++) {
      menuUrl += `/${menuUrlNames[i]}`;
    }

    const menuObj = getMenuRecursive(menuList, menuUrl);
    let menuNm = menuObj ? menuObj.menuNm : '';

    return [menuNm, menuUrl];
  };

  const goToHome = () => {
    navigate(contextPath);
  };

  const goToMenu = (menuUrl: string) => {
    navigate(menuUrl);
  };

  return (
    <Stack>
      <Breadcrumb seperator="Arrow" showHomeIcon={true}>
        <BreadcrumbItem isCurrentPage={false}>
          <BreadcrumbLink onClick={goToHome}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {menuUrlNames.map(
          (menuUrl, index) =>
            menuUrl !== 'admin' && (
              <BreadcrumbItem
                key={`${menuUrl}-${index}`}
                isCurrentPage={menuUrlNames.length - 1 === index ? true : false}
              >
                {(() => {
                  const [menuNm, menuUrl] = getMenuInfo(index);
                  return <BreadcrumbLink onClick={() => goToMenu(menuUrl)}>{menuNm}</BreadcrumbLink>;
                })()}
              </BreadcrumbItem>
            )
        )}
      </Breadcrumb>
    </Stack>
  );
};
export default MainNavigation;
