import ErrorRouteBoundary from '@/components/error/ErrorRouteBoundary';
import RootLayout from '@/components/layout';
import { useMainLoader } from '@/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath } from '@/models/common/Constants';
import { adminMenulist, userMenuList } from '@/models/common/Menu';
import { login, selectContextPath, selectSessionInfo, setContextPath } from '@/reducers/authSlice';
import { setBaseMenuList, setMenuList } from '@/reducers/menuSlice';
import { setBaseApiUrl } from '@/utils/ApiUtil';
import { convertToHierarchyInfo, sortChildrenRecursive } from '@/utils/ArrayUtil';
import SessionApis from '@api/common/SessionApis';
import CommonResponse from '@models/common/CommonResponse';
import { SessionInfo, SessionRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import { useCallback, useEffect, useState } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const useAuth = (sessionUtil: SessionUtil, sessionApis: SessionApis, sessionRequestInfo?: SessionRequest) => {
  const dispatch = useAppDispatch();
  const pathname = window.location.pathname;
  const sessionInfo = useAppSelector(selectSessionInfo());
  const contextPath = useAppSelector(selectContextPath());
  const [router, setRouter] = useState<any>();
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const transferLocalStorage = useCallback(() => {
    const localTokenInfo = sessionUtil.getLocalAccessTokenRefreshTokenInfo();
    const localSessionRequestInfo = sessionUtil.getLocalSessionRequestInfo();
    const localSessionInfo = sessionUtil.getLocalSessionInfo();

    if (localTokenInfo.refreshToken) {
      sessionUtil.setAccessTokenRefreshTokenInfo(localTokenInfo);
      sessionUtil.setSessionRequestInfo(localSessionRequestInfo);
      sessionUtil.setSessionInfo(localSessionInfo);
    }
    sessionUtil.deleteLocalStorage();
  }, [sessionUtil]);

  const getMenuParentId = (menuUrl: string) => {
    return menuUrl.substring(0, menuUrl.lastIndexOf('/'));
  };

  const filterRouterRecursive = useCallback(
    (routerList: Array<any>, filteredMenuList: Array<any>): Array<any> | undefined => {
      if (routerList) {
        return routerList.reduce((acc, routerItem) => {
          if (filteredMenuList.find((menuItem) => menuItem.menuUrl === routerItem.id || !routerItem.id)) {
            const filteredChildren = filterRouterRecursive(routerItem.children, filteredMenuList);

            acc.push({
              ...routerItem,
              children: filteredChildren,
            });
          }

          return acc;
        }, []);
      }
    },
    []
  );

  useEffect(() => {
    if (sessionRequestInfo?.googleAccessToken && !sessionInfo.sessionId && !isError && !unauthorized) {
      (async () => {
        const sessionResponse: CommonResponse = await sessionApis.login(sessionRequestInfo);

        if (sessionResponse.successOrNot === 'Y') {
          const sessionInfo: SessionInfo = sessionResponse.data as SessionInfo;
          sessionUtil.setSessionInfo(sessionInfo);

          let contextPath;
          let baseMenuList: Array<any> = [];
          let myMenuList: Array<any> = [];
          let routerFileName;

          if (pathname.startsWith(ContextPath.ADMIN)) {
            if (!sessionInfo.apldMgrAuthId) {
              setUnauthorized(true);
              return;
            }
            contextPath = ContextPath.ADMIN;
            baseMenuList = adminMenulist;
            myMenuList = sessionInfo.menuByAuthMgr?.menus || [];
            routerFileName = 'adminRouter';
            setBaseApiUrl('/bo');
          } else if (pathname.startsWith(ContextPath.POPUP)) {
            if (!sessionInfo.apldUserAuthId) {
              setUnauthorized(true);
              return;
            }
            contextPath = ContextPath.POPUP;
            transferLocalStorage();
            setBaseApiUrl('/fo');
          } else {
            if (!sessionInfo.apldUserAuthId) {
              setUnauthorized(true);
              return;
            }
            contextPath = ContextPath.USER;
            baseMenuList = userMenuList;
            myMenuList = sessionInfo.menuByAuthUser?.menus || [];
            routerFileName = 'userRouter';
            setBaseApiUrl('/fo');
          }

          const routerList = await import(`@router/${routerFileName}`)
            .then((module) => module.default)
            .catch((reject) => reject([]));

          // 권한 있는 메뉴만 필터
          const filteredMenuList = myMenuList.filter((myMenuItem: any) =>
            baseMenuList.find(
              (menuItem: any) =>
                myMenuItem.menuUrl === menuItem.menuUrl ||
                (myMenuItem.menuUrl === menuItem.menuUrl && menuItem.isCrudPage)
            )
          );

          // 라우터 필터
          const filteredRouterList = filterRouterRecursive(routerList, filteredMenuList);

          // 메뉴 계층 구조로 변환
          const hierarchyMenuList = convertToHierarchyInfo(
            filteredMenuList.map((item: any) => ({
              ...item,
              id: item.menuUrl,
              parentId: getMenuParentId(item.menuUrl),
            }))
          );

          // 메뉴 순서대로 정렬
          sortChildrenRecursive(hierarchyMenuList);

          const router = [
            {
              path: contextPath,
              loader: useMainLoader,
              element: <RootLayout />,
              errorElement: <ErrorRouteBoundary />,
              children: filteredRouterList,
            },
          ];

          dispatch(setContextPath(contextPath));
          dispatch(login(sessionInfo));
          dispatch(setBaseMenuList(baseMenuList));
          dispatch(setMenuList(hierarchyMenuList));
          setRouter(createBrowserRouter(router));
          window.history.pushState({}, '', localStorage.getItem('accessPathname'));
        } else if (sessionResponse.status === 401) {
          sessionUtil.deleteSessionInfo();
          sessionApis.oauthLogin();
        } else {
          setIsError(true);
        }
      })();
    }
  }, [
    sessionApis,
    sessionUtil,
    sessionRequestInfo,
    sessionInfo,
    isError,
    contextPath,
    pathname,
    unauthorized,
    filterRouterRecursive,
    transferLocalStorage,
    dispatch,
  ]);

  return { sessionInfo, router, isError, unauthorized };
};

export default useAuth;
