import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { selectMenuList } from '@/reducers/menuSlice';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Stack } from '@components/ui';
import { useLocation, useNavigate } from 'react-router-dom';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((path) => path);
  const menuList = useAppSelector(selectMenuList())!;
  const contextPath = useAppSelector(selectContextPath());

  const getMenuRecursive = (menuList: any[], path: string): any | undefined => {
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].path === path || menuList[i].path === '*') {
        return menuList[i];
      } else {
        if (menuList[i].children) {
          const menuObj = getMenuRecursive(menuList[i].children, path);

          if (menuObj) {
            return menuObj;
          }
        }
      }
    }
  };

  const getMenuInfo = (index: number): Array<string> => {
    let path = '';

    for (let i = 0; i <= index; i++) {
      path += `/${pathnames[i]}`;
    }

    const menuObj = getMenuRecursive(menuList, path);
    let name = menuObj ? menuObj.name : '';

    return [name, path];
  };

  const goToHome = () => {
    navigate(contextPath);
  };

  const goToMenu = (path: string) => {
    navigate(path);
  };

  return (
    <Stack>
      <Breadcrumb seperator="Arrow" showHomeIcon={true}>
        <BreadcrumbItem isCurrentPage={false}>
          <BreadcrumbLink onClick={goToHome}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map(
          (path, index) =>
            path !== 'admin' && (
              <BreadcrumbItem key={`${path}-${index}`} isCurrentPage={pathnames.length - 1 === index ? true : false}>
                {(() => {
                  const [name, path] = getMenuInfo(index);
                  return <BreadcrumbLink onClick={() => goToMenu(path)}>{name}</BreadcrumbLink>;
                })()}
              </BreadcrumbItem>
            )
        )}
      </Breadcrumb>
    </Stack>
  );
};
export default MainNavigation;
