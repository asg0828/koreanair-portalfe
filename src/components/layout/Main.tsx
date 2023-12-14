import { useAppSelector } from '@/hooks/useRedux';
import { selectMenuList } from '@/reducers/menuSlice';
import { findMenuRecursive } from '@/utils/ArrayUtil';
import MainNavigation from '@components/layout/MainNavigation';
import { Loader, Stack, Typography } from '@components/ui';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Main.scss';

const Main = () => {
  const location = useLocation();
  const menuList = useAppSelector(selectMenuList())!;
  const menuObj = findMenuRecursive(menuList, location.pathname);
  const title = menuObj ? menuObj.menuNm : '';

  return (
    <>
      <main id="main" className="width-100">
        <Stack direction="Vertical" gap="MD" className="height-100">
          <MainNavigation />

          <Stack className="width-100" gap="MD">
            <Typography variant="h1">{title}</Typography>
            <span className="star"></span>
            {/* <span className="star active"></span> */}
            {/* <StarBorderIcon  /> */}
          </Stack>

          <Suspense
            fallback={
              <Stack justifyContent="Center" className="height-100 width-100">
                <Loader title="진행중" description="잠시만 기다려주세요" />
              </Stack>
            }
          >
            <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
              <Outlet />
            </Stack>
          </Suspense>
        </Stack>
      </main>
    </>
  );
};
export default Main;
