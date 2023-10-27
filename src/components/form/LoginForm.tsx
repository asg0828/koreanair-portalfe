import { useDispatch, useSelector } from 'react-redux';
import CustomRouter, { userRouter, adminRouter, testRouter } from '@/router';
import { ReducerType } from '@reducers';
import { authSlice, menuSlice } from '@/reducers';
import userMenuList from '@/router/data/userMenuList';
import adminMenuList from '@/router/data/adminMenuList';
import testMenulist from '@/router/data/testMenuList';
import { Stack, Loader } from '@components/ui';
import NotFound from '@/pages/Error';

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
    setTimeout(() => {
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
    }, 1000);
  }

  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  );
};
export default LoginForm;
