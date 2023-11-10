import NotFound from '@/pages/Error';
import { authSlice, menuSlice, ReducerType } from '@/reducers';
import CustomRouter, { adminRouter, testRouter, userRouter } from '@/router';
import adminMenuList from '@/router/data/adminMenuList';
import testMenulist from '@/router/data/testMenuList';
import userMenuList from '@/router/data/userMenuList';
import { Loader, Stack } from '@components/ui';
import { useDispatch, useSelector } from 'react-redux';

const LoginForm = () => {
  const auth = useSelector((state: ReducerType) => state.auth);
  const isAdminPage = window.location.pathname.substring(0, 6) === '/admin';
  const isTestPage = window.location.pathname.substring(0, 5) === '/test';
  const dispatch = useDispatch();

  if (auth.userInfo) {
    let router;
    let component;

    if (auth.userInfo.isAdmin) {
      if (isAdminPage) {
        dispatch(menuSlice.actions.setMenuList(adminMenuList));
        router = adminRouter;
      } else if (isTestPage) {
        dispatch(menuSlice.actions.setMenuList(testMenulist));
        router = testRouter;
      } else {
        dispatch(menuSlice.actions.setMenuList(userMenuList));
        router = userRouter;
      }
      component = <CustomRouter router={router} />;
    } else {
      if (isAdminPage || isTestPage) {
        component = <NotFound />;
      } else {
        component = <CustomRouter router={userMenuList} />;
      }
    }

    return component;
  } else {
    const authInfo = {
      isAdminPage: isAdminPage,
      userInfo: {
        userId: 'test',
        userNm: 'test',
        pstnCode: 'test',
        detpCode: 'test',
        authId: 'test',
        isAdmin: true,
      },
    };
    dispatch(authSlice.actions.login(authInfo));
  }

  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  );
};
export default LoginForm;
