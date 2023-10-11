import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MenuItem } from '@models/common/Menu';
import { ReducerType } from '@reducers';
import { indexPathMap } from '@models/common/Menu';
import { Stack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button } from '@components/ui';

const indexPath: indexPathMap = {
  '/board': '/board/notice',
  '/biz-meta': '/biz-meta/dataset',
  '/self-bi': '/self-bi/tableau',
  '/structured-report': '/structured-report/structured-report',
  '/feature': '/feature/popular',
  '/customer-info': '/customer-info/dashboard',
  '/self-feature': '/self-feature/self-feature',
};

const MainNavigation = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((path) => path);
  const menuList = useSelector((state: ReducerType) => state.menu.menuList)!;

  const getMenuRecursive = (menuList: MenuItem[], path: string): MenuItem | undefined => {
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
    let name = menuObj ? menuObj.name : 'UnKown headerName';

    path = indexPath[path] || path;

    return [name, path];
  };

  return (
    <Stack>
      <Breadcrumb seperator="Arrow" showHomeIcon={true}>
        <BreadcrumbItem isCurrentPage={false}>
          <BreadcrumbLink href={'/'}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((path, index) => (
          <BreadcrumbItem key={`${path}-${index}`} isCurrentPage={pathnames.length - 1 === index ? true : false}>
            {(() => {
              const [name, path] = getMenuInfo(index);
              return <BreadcrumbLink href={path}>{name}</BreadcrumbLink>;
            })()}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Stack>
  );
};
export default MainNavigation;
