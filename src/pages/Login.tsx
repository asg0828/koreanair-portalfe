import { useDispatch, useSelector } from 'react-redux';
import Router from '@/router';
import { ReducerType } from '@reducers';
import { authActions } from '@/reducers/authSlice';
import { menuActions } from '@/reducers/menuSlice';
import userMenuList from '@utils/data/userMenuList';
import adminMenuList from '@utils/data/adminMenuList';
import { Stack, Loader } from '@components/ui';

const Login = () => {
  const auth = useSelector((state: ReducerType) => state.auth);
  const menu = useSelector((state: ReducerType) => state.menu);
  const dispatch = useDispatch();

  if (auth.isLogin) {
    if (menu.menuList.length === 0) {
      dispatch(menuActions.setMenuList(userMenuList));
    }

    return <Router />;
  } else {
    setTimeout(() => {
      dispatch(authActions.login());
    }, 1000);
  }

  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader
        title="진행중"
        description="잠시만 기다려주세요"
      />
    </Stack>
  );
};
export default Login;
