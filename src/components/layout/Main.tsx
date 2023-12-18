import { useCreateQuickMenu, useDeleteQuickMenu } from '@/hooks/mutations/useQuickMenuMutations';
import { useQuickMenuList } from '@/hooks/queries/useQuickMenuQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ValidType } from '@/models/common/Constants';
import { selectSessionInfo } from '@/reducers/authSlice';
import { selectMenuList, selectQuickMenuList, setQuickMenuList } from '@/reducers/menuSlice';
import { findMenuRecursive } from '@/utils/ArrayUtil';
import MainNavigation from '@components/layout/MainNavigation';
import { Loader, Stack, Typography, useToast } from '@components/ui';
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Main.scss';

const Main = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const sessionInfo = useAppSelector(selectSessionInfo());
  const menuList = useAppSelector(selectMenuList());
  const quickMenuList = useAppSelector(selectQuickMenuList());
  const menuObj = findMenuRecursive(menuList, location.pathname);
  const [active, setActive] = useState(false);
  const {
    data: qmResponse,
    isSuccess: qmIsSuccess,
    isError: qmError,
    refetch: qmRefetch,
  } = useQuickMenuList(sessionInfo.userId);
  const { data: cqResponse, isSuccess: cqIsSuccess, isError: cqIsError, mutate: cqMutate } = useCreateQuickMenu();
  const { data: dqResponse, isSuccess: dqIsSuccess, isError: dqIsError, mutate: dqMutate } = useDeleteQuickMenu();

  const handleClickStar = () => {
    if (active) {
      dqMutate({
        userId: sessionInfo.userId,
        menuId: menuObj.menuId,
      });
    } else {
      cqMutate({
        userId: sessionInfo.userId,
        menuId: menuObj.menuId,
      });
    }
  };

  useEffect(() => {
    setActive(quickMenuList.find((item) => item.menuId === menuObj?.menuId));
  }, [quickMenuList, menuObj]);

  useEffect(() => {
    if (qmError || qmResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '퀵 메뉴 조회 중 에러가 발생했습니다.',
      });
    } else if (qmIsSuccess) {
      if (qmResponse?.data) {
        dispatch(setQuickMenuList(qmResponse.data.menus));
      }
    }
  }, [qmResponse, qmIsSuccess, qmError, dispatch, toast]);

  useEffect(() => {
    if (cqIsError || cqResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '퀵 메뉴 등록 중 에러가 발생했습니다.',
      });
    } else if (cqIsSuccess) {
      toast({
        type: ValidType.INFO,
        content: '퀵 메뉴가 추가되었습니다.',
      });
      qmRefetch();
    }
  }, [cqResponse, cqIsSuccess, cqIsError, qmRefetch, dispatch, toast]);

  useEffect(() => {
    if (dqIsError || dqResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '퀵 메뉴 삭제 중 에러가 발생했습니다.',
      });
    } else if (dqIsSuccess) {
      toast({
        type: ValidType.INFO,
        content: '퀵 메뉴가 삭제되었습니다.',
      });
      qmRefetch();
    }
  }, [dqResponse, dqIsSuccess, dqIsError, qmRefetch, dispatch, toast]);

  return (
    <>
      <main id="main" className="width-100">
        <Stack direction="Vertical" gap="MD" className="height-100">
          <MainNavigation />

          <Stack className="width-100" gap="MD">
            <Typography variant="h1">{menuObj?.menuNm}</Typography>
            <span className={`star ${active ? 'active' : ''}`} onClick={handleClickStar} />
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
