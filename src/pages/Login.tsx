import { useDispatch, useSelector } from 'react-redux';
import CustomRouter from '@/router';
import { ReducerType } from '@reducers';
import { authActions } from '@/reducers/authSlice';
import { menuActions } from '@/reducers/menuSlice';
import userMenuList from '@utils/data/userMenuList';
import adminMenuList from '@utils/data/adminMenuList';
import { Stack, Loader } from '@components/ui';
import NotFound from '@/pages/Error';
import { userRouter } from '@router/user';
import { adminRouter } from '@router/admin';

const Login = () => {
  const auth = useSelector((state: ReducerType) => state.auth);
  const dispatch = useDispatch();
  const isAdminPage = window.location.pathname.substring(0, 6) === '/admin';

  if (auth.userInfo) {
    if (isAdminPage) {
      if (auth.userInfo.isAdmin) {
        dispatch(menuActions.setMenuList(adminMenuList));
        return <CustomRouter router={adminRouter} />;
      } else {
        return <NotFound />;
      }
    } else {
      dispatch(menuActions.setMenuList(userMenuList));
      return <CustomRouter router={userRouter} />;
    }
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
      dispatch(authActions.login(authInfo));
    }, 1000);
  }

  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  );
};
export default Login;
