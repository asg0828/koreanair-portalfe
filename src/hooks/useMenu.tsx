import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath } from '@/models/common/Constants';
import { setMenuList } from '@/reducers/menuSlice';
import { SessionInfo, SessionRequest } from '@models/common/Session';
import { useEffect, useState } from 'react';

const useMenu = (sessionRequestInfo: SessionRequest, sessionInfo: SessionInfo) => {
  const dispatch = useAppDispatch();
  const menuList = useAppSelector((state) => state.menu.menuList);
  const contextPath = useAppSelector((state) => state.auth.contextPath);
  const [routerList, setRouterList] = useState<Array<any>>([]);

  useEffect(() => {
    if (sessionRequestInfo.googleAccessToken && sessionInfo.sessionId && menuList.length === 0) {
      (async () => {
        let menuFileName;
        let routerFileName;

        if (contextPath === ContextPath.ADMIN || contextPath === ContextPath.ADMIN_POPUP) {
          menuFileName = 'adminMenuList';
          routerFileName = 'adminRouter';
        } else if (contextPath === ContextPath.TEST) {
          menuFileName = 'testMenuList';
          routerFileName = 'testRouter';
        } else {
          menuFileName = 'userMenuList';
          routerFileName = 'userRouter';
        }

        const resultMenuList = await import(`@router/data/${menuFileName}`).then((module) => module.default);
        const resultRouterList = await import(`@router/${routerFileName}`).then((module) => module.default);
        setRouterList(resultRouterList);
        dispatch(setMenuList(resultMenuList));
      })();
    }
  }, [sessionRequestInfo, sessionInfo, contextPath, menuList.length, dispatch]);

  return [routerList];
};

export default useMenu;
