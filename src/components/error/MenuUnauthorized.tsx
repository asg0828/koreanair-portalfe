import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { useNavigate } from 'react-router';

const MenuUnauthorized = () => {
  const navigate = useNavigate();
  const contextPath = useAppSelector(selectContextPath());

  const handleConfirm = () => {
    navigate(contextPath);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <EmptyState
        type="warning"
        description="메뉴 권한이 없습니다."
        confirmText="홈으로"
        cancleText="이전으로"
        onConfirm={handleConfirm}
        onCancle={handleCancel}
      />
    </>
  );
};
export default MenuUnauthorized;
