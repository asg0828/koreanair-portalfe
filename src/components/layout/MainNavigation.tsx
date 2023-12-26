import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { selectMenuList } from '@/reducers/menuSlice';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Stack } from '@components/ui';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const MainNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const menuUrlNames = location.pathname.split('/').filter((menuUrl) => menuUrl);
  const menuList = useAppSelector(selectMenuList())!;
  const contextPath = useAppSelector(selectContextPath());

  const getMenuRecursive = (cMenuList: any[], menuUrl: string): any | undefined => {
    for (let i = 0; i < cMenuList.length; i++) {
      if (cMenuList[i].menuUrl === menuUrl || cMenuList[i].menuUrl === '*') {
        return cMenuList[i];
      } else {
        if (cMenuList[i].children) {
          const menuObj = getMenuRecursive(cMenuList[i].children, menuUrl);

          if (menuObj) {
            return menuObj;
          }
        }
      }
    }
  };

  const getMenuInfo = (index: number): Array<string> => {
    let cMenuUrl = '';

    for (let i = 0; i <= index; i++) {
      cMenuUrl += `/${menuUrlNames[i]}`;
    }

    const menuObj = getMenuRecursive(menuList, cMenuUrl);
    let menuNm = menuObj ? menuObj.menuNm : '';

    return [menuNm, cMenuUrl];
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
          <BreadcrumbLink onClick={goToHome}>{t('common.label.home')}</BreadcrumbLink>
        </BreadcrumbItem>
        {menuUrlNames.map(
          (menuUrl, index) =>
            menuUrl !== 'admin' && (
              <BreadcrumbItem
                key={`${menuUrl}-${index}`}
                isCurrentPage={menuUrlNames.length - 1 === index ? true : false}
              >
                {(() => {
                  const [menuNm, cMenuUrl] = getMenuInfo(index);
                  return <BreadcrumbLink onClick={() => goToMenu(cMenuUrl)}>{menuNm}</BreadcrumbLink>;
                })()}
              </BreadcrumbItem>
            )
        )}
      </Breadcrumb>
    </Stack>
  );
};
export default MainNavigation;
