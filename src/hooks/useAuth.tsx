import ErrorRouteBoundary from '@/components/error/ErrorRouteBoundary';
import RootLayout from '@/components/layout';
import { useQuickMenuList } from '@/hooks/queries/useQuickMenuQueries';
import { useMainLoader } from '@/hooks/useLoader';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ValidType } from '@/models/common/Constants';
import { adminMenulist, userMenuList } from '@/models/common/Menu';
import { login, selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { setBaseMenuList, setMenuList, setQuickMenuList } from '@/reducers/menuSlice';
import { convertToHierarchyInfo, sortChildrenRecursive } from '@/utils/ArrayUtil';
import SessionApis from '@api/common/SessionApis';
import { useToast } from '@ke-design/components';
import CommonResponse from '@models/common/CommonResponse';
import { SessionInfo, SessionRequest } from '@models/common/Session';
import SessionUtil from '@utils/SessionUtil';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter } from 'react-router-dom';

const useAuth = (sessionUtil: SessionUtil, sessionApis: SessionApis, sessionRequestInfo?: SessionRequest) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const sessionInfo = useAppSelector(selectSessionInfo());
  const contextPath = useAppSelector(selectContextPath());
  const [router, setRouter] = useState<any>();
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const {
    data: qmResponse,
    isSuccess: qmIsSuccess,
    isError: qmError,
    refetch: qmRefetch,
  } = useQuickMenuList(sessionInfo.userId);

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
    if (qmError || qmResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.quickMenu.toast.error.list'),
      });
    } else if (qmIsSuccess) {
      if (qmResponse?.data) {
        dispatch(setQuickMenuList(qmResponse.data.menus));
      }
    }
  }, [qmResponse, qmIsSuccess, qmError, dispatch, toast]);

  useEffect(() => {
    if (sessionInfo.userId) {
      qmRefetch();
    }
  }, [sessionInfo.userId, qmRefetch]);

  useEffect(() => {
    if (
      contextPath !== ContextPath.UNAUTHORIZED &&
      sessionRequestInfo?.googleAccessToken &&
      !sessionInfo.sessionId &&
      !isError &&
      !unauthorized
    ) {
      (async () => {
        const sessionResponse: CommonResponse = await sessionApis.login(sessionRequestInfo);

        if (sessionResponse.successOrNot === 'Y') {
          const nSessionInfo: SessionInfo = sessionResponse.data as SessionInfo;
          sessionUtil.setSessionInfo(nSessionInfo);

          let baseMenuList: Array<any> = [];
          let myMenuList: Array<any> = [];
          let routerFileName;

          if (contextPath === ContextPath.ADMIN) {
            if (!nSessionInfo.apldMgrAuthId) {
              setUnauthorized(true);
              return;
            }
            baseMenuList = adminMenulist;
            myMenuList = nSessionInfo.menuByAuthMgr?.menus || [];
            routerFileName = 'adminRouter';
          } else if (contextPath === ContextPath.POPUP) {
            if (!nSessionInfo.apldUserAuthId) {
              setUnauthorized(true);
              return;
            }
            transferLocalStorage();
          } else {
            if (!nSessionInfo.apldUserAuthId) {
              setUnauthorized(true);
              return;
            }
            baseMenuList = userMenuList;
            myMenuList = nSessionInfo.menuByAuthUser?.menus || [];
            routerFileName = 'userRouter';
          }

          const routerList = await import(`@router/${routerFileName}`)
            .then((module) => module.default)
            .catch((reject) => reject([]));

          // 마이메뉴와 매핑되는 CRUD 메뉴 필터
          const crudMenuList = baseMenuList.filter((baseMenuItem: any) =>
            myMenuList.find((myMenuItem) => {
              if (myMenuItem.menuUrl === getMenuParentId(baseMenuItem.menuUrl) && baseMenuItem.isCrudPage) {
                baseMenuItem.upMenuId = myMenuItem.menuId;
                if (baseMenuItem.menuUrl.endsWith('/reg')) {
                  baseMenuItem.menuId = `${myMenuItem.menuId}-reg`;
                  baseMenuItem.menuNm = `${myMenuItem.menuNm} ${t('common.button.reg')}`;
                } else if (baseMenuItem.menuUrl.endsWith('/detail')) {
                  baseMenuItem.menuId = `${myMenuItem.menuId}-detail`;
                  baseMenuItem.menuNm = `${myMenuItem.menuNm} ${t('common.button.detail')}`;
                } else if (baseMenuItem.menuUrl.endsWith('/edit')) {
                  baseMenuItem.menuId = `${myMenuItem.menuId}-edit`;
                  baseMenuItem.menuNm = `${myMenuItem.menuNm} ${t('common.button.edit')}`;
                }
                return true;
              }
              return false;
            })
          );
          const filteredMenuList = myMenuList.concat(crudMenuList);

          // 라우터 필터
          const filteredRouterList = filterRouterRecursive(routerList, filteredMenuList);

          // 메뉴 계층 구조로 변환
          const hierarchyMenuList = convertToHierarchyInfo(
            filteredMenuList.map((item: any) => ({
              ...item,
              id: item.menuId,
              parentId: item.upMenuId,
            }))
          );

          // 메뉴 순서대로 정렬
          sortChildrenRecursive(hierarchyMenuList);

          const nRouter = [
            {
              path: contextPath,
              loader: useMainLoader,
              element: <RootLayout />,
              errorElement: <ErrorRouteBoundary />,
              children: filteredRouterList,
            },
          ];

          dispatch(login(nSessionInfo));
          dispatch(setBaseMenuList(baseMenuList));
          dispatch(setMenuList(hierarchyMenuList));
          setRouter(nRouter);
        } else {
          setIsError(true);
        }
      })();
    }
  }, [sessionRequestInfo, contextPath]);

  return { sessionInfo, router, isError, unauthorized };
};

export default useAuth;
